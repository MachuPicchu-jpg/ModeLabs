const { db } = require('../config/firebase');
const { getDatasetSamples } = require('../services/datasetService');
const { evaluateExample, buildPrompt } = require('../services/evaluationService');
const { evaluateResults } = require('../services/metricsService');

// 获取评测指标
const getMetricsForTaskType = (taskType) => {
  const metricsByType = {
    classification: ['accuracy', 'precision', 'recall', 'f1'],
    generation: ['bleu', 'rouge', 'perplexity'],
    qa: ['f1', 'exact_match', 'rouge'],
    dialogue: ['response_appropriateness', 'coherence', 'engagement'],
    regression: ['mse', 'mae', 'rmse']
  };
  return metricsByType[taskType] || [];
};

// 自动检测数据集类型
const detectDatasetType = (samples) => {
  if (!samples || samples.length === 0) return null;

  const firstSample = samples[0];
  const fields = Object.keys(firstSample);

  // 检查是否是分类任务
  if (fields.some(f => ['label', 'category', 'class'].includes(f.toLowerCase()))) {
    return 'classification';
  }

  // 检查是否是问答任务
  if ((fields.includes('question') && fields.includes('answer')) ||
      (fields.includes('input') && fields.includes('output') && 
       typeof firstSample.input === 'string' && firstSample.input.includes('?'))) {
    return 'qa';
  }

  // 检查是否是对话任务
  if (fields.includes('dialogue') || fields.includes('conversation') ||
      (fields.includes('input') && fields.includes('response'))) {
    return 'dialogue';
  }

  // 检查是否是生成任务
  if (fields.includes('prompt') || fields.includes('completion') ||
      (fields.includes('source') && fields.includes('target'))) {
    return 'generation';
  }

  // 检查是否是回归任务
  const hasNumericTarget = fields.some(field => {
    const value = firstSample[field];
    return typeof value === 'number' || !isNaN(parseFloat(value));
  });
  if (hasNumericTarget) {
    return 'regression';
  }

  return null;
};

// 使用大模型分析数据集类型
const analyzeDatasetType = async (datasetSample) => {
  try {
    // 首先使用自动检测
    const detectedType = detectDatasetType(datasetSample.samples);
    
    // 如果自动检测成功，直接使用检测结果
    if (detectedType) {
      const metrics = getMetricsForTaskType(detectedType);
      return {
        taskType: detectedType,
        metrics,
        explanation: {
          datasetStructure: `数据集包含字段: ${datasetSample.fields.join(', ')}`,
          detectionMethod: '通过字段名和数据结构自动检测',
          taskDescription: `根据数据集结构判断为${detectedType}任务`
        }
      };
    }

    // 如果自动检测失败，使用大模型分析
    const prompt = `��析以下数据集样本的任务类型。
数据集格式：${datasetSample.format}
数据集字段：${datasetSample.fields.join(', ')}
数据集样本：
${JSON.stringify(datasetSample.samples.slice(0, 3), null, 2)}

请仔细分析这个数据集的结构和内容，并返回一个JSON格式的响应，包含以下字段：
1. taskType: 任务类型，可选值：
   - classification（分类任务）
   - generation（生成任务）
   - qa（问答任务）
   - dialogue（对话任务）
   - regression（回归任务）
2. metrics: 建议使用的评测指标数组，例如：
   - 分类任务：["accuracy", "precision", "recall", "f1"]
   - 生成任务：["bleu", "rouge", "perplexity"]
   - 问答任务：["f1", "exact_match", "rouge"]
   - 对话任务：["response_appropriateness", "coherence", "engagement"]
   - 回归任务：["mse", "mae", "rmse"]
3. explanation: 详细解释为什么判断是这个任务类型，包括：
   - 数据集结构特征
   - 输入输出字段的对应关系
   - 任务目标分析

只返回JSON格式的响应，不要有其他文字。`;

    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer sk-jqrztcgqmypynjhcdwnfmmjiuuelofvkjnwojhhmxdmiexry',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    };

    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', options);
    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing dataset type:', error);
    throw error;
  }
};

const startEvaluation = async (req, res) => {
  try {
    const { modelId, modelType, datasetId } = req.body;
    console.log('Received evaluation request:', { modelId, modelType, datasetId });

    if (!modelId || !modelType || !datasetId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    // 1. 获取数据集样本并进行预处理
    const datasetSample = await getDatasetSamples(datasetId, 3);

    // 2. 分析数据集类型并确定评测指标
    const analysisResult = await analyzeDatasetType(datasetSample);

    // 3. 创建评测任务
    const task = {
      modelId,
      modelType,
      datasetId,
      taskType: analysisResult.taskType,
      metrics: analysisResult.metrics,
      status: 'pending',
      datasetFormat: datasetSample.format,
      datasetFields: datasetSample.fields,
      detectionMethod: datasetSample.detectedType ? 'automatic' : 'ai_analysis',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const taskRef = await db.collection('evaluation-tasks').add(task);
    console.log('Created evaluation task:', { taskId: taskRef.id, ...task });

    // 4. 返回任务信息
    res.status(200).json({
      success: true,
      message: 'Evaluation task created and started',
      taskId: taskRef.id,
      taskType: analysisResult.taskType,
      metrics: analysisResult.metrics,
      explanation: analysisResult.explanation,
      datasetInfo: {
        format: datasetSample.format,
        fields: datasetSample.fields,
        detectedType: datasetSample.detectedType
      }
    });

    // 5. 启动评测任务（异步）
    runEvaluation(taskRef.id).catch(error => {
      console.error('Error during evaluation:', error);
      updateTaskStatus(taskRef.id, 'failed', error.message);
    });

  } catch (error) {
    console.error('Error starting evaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start evaluation',
      error: error.message
    });
  }
};

const getTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const taskDoc = await db.collection('evaluation-tasks').doc(taskId).get();

    if (!taskDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const task = taskDoc.data();
    const results = task.status === 'completed' ? 
      await db.collection('evaluation-results').doc(taskId).get().then(doc => doc.data()) : 
      null;

    res.status(200).json({
      success: true,
      task: {
        ...task,
        id: taskId
      },
      results
    });

  } catch (error) {
    console.error('Error getting task status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get task status',
      error: error.message
    });
  }
};

const updateTaskStatus = async (taskId, status, error = null) => {
  try {
    await db.collection('evaluation-tasks').doc(taskId).update({
      status,
      error,
      updatedAt: new Date()
    });
  } catch (err) {
    console.error('Error updating task status:', err);
  }
};

const runEvaluation = async (taskId) => {
  const taskRef = db.collection('evaluation-tasks').doc(taskId);
  
  try {
    console.log('Starting evaluation for task:', taskId);
    
    // Update task status to running
    await taskRef.update({
      status: 'running',
      updatedAt: new Date()
    });

    // Get task details
    const taskDoc = await taskRef.get();
    const task = taskDoc.data();
    console.log('Task details:', task);

    // Get complete dataset
    const datasetSamples = await getDatasetSamples(task.datasetId);
    console.log('Dataset samples loaded:', datasetSamples.samples.length);

    // Process each sample
    const results = [];
    for (const sample of datasetSamples.samples) {
      try {
        console.log('Processing sample:', sample);
        
        // Build prompt based on task type
        const prompt = buildPrompt(sample, task.taskType);
        console.log('Built prompt:', prompt);
        
        // Call model API
        const prediction = await evaluateExample(prompt, task.modelId, task.modelType);
        console.log('Model prediction:', prediction);

        // Store result
        results.push({
          prediction,
          groundTruth: {
            target: sample.output || sample.label || sample.sentiment || sample.text || '',
          }
        });
      } catch (error) {
        console.error('Error processing sample:', error);
        // Continue with next sample
      }
    }

    console.log('All samples processed, calculating metrics');
    
    // Calculate metrics
    const metrics = evaluateResults(results, task.taskType);
    console.log('Evaluation metrics:', metrics);

    // Save results
    await db.collection('evaluation-results').doc(taskId).set({
      taskId,
      results,
      metrics,
      completedAt: new Date()
    });

    // Update task status
    await taskRef.update({
      status: 'completed',
      updatedAt: new Date()
    });

    console.log('Evaluation completed successfully');

  } catch (error) {
    console.error('Error running evaluation:', error);
    await taskRef.update({
      status: 'failed',
      error: error.message,
      updatedAt: new Date()
    });
    throw error;
  }
};

const getAllTasks = async (req, res) => {
  try {
    // 获取所有评测任务
    const tasksSnapshot = await db.collection('evaluation-tasks')
      .orderBy('createdAt', 'desc')
      .get();

    const tasks = [];
    for (const doc of tasksSnapshot.docs) {
      const task = doc.data();
      const taskId = doc.id;

      // 如果任务已完成，获取评测结果
      let results = null;
      if (task.status === 'completed') {
        const resultsDoc = await db.collection('evaluation-results').doc(taskId).get();
        if (resultsDoc.exists) {
          results = resultsDoc.data();
        }
      }

      tasks.push({
        id: taskId,
        ...task,
        results
      });
    }

    res.status(200).json({
      success: true,
      tasks
    });

  } catch (error) {
    console.error('Error getting all tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tasks',
      error: error.message
    });
  }
};

module.exports = {
  startEvaluation,
  getTaskStatus,
  getAllTasks
}; 