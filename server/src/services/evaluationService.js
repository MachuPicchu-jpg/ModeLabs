const { db } = require('../config/firebase');

const buildPrompt = (sample, taskType) => {
  // 首先确定输入文本
  const input = sample.input || sample.sentence || sample.text || sample.question || '';
  
  switch (taskType) {
    case 'classification':
      return `请对以下文本进行情感分类，如果是积极的返回1，消极的返回0：\n${input}`;
    case 'generation':
      return `${input}`;
    case 'qa':
      return `问题：${input}\n请回答上述问题。`;
    case 'dialogue':
      return `${input}`;
    case 'regression':
      return `请根据以下输入预测一个数值：\n${input}`;
    default:
      return input;
  }
};

const callModelAPI = async (model, prompt) => {
  const apiEndpoint = model.api_url || 'https://api.siliconflow.cn/v1/chat/completions';
  const apiKey = model.api_token;

  if (!apiKey) {
    throw new Error('Model API key not found');
  }

  // 构建请求体
  let requestBody = {
    messages: [{ role: "user", content: prompt }]
  };

  // 添加模型特定的参数
  if (model.model_name) {
    requestBody.model = model.model_name;
  }

  if (model.temperature !== undefined) {
    requestBody.temperature = model.temperature;
  }

  if (model.max_tokens !== undefined) {
    requestBody.max_tokens = model.max_tokens;
  }

  // 发送请求
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.statusText}\n${errorText}`);
  }

  const result = await response.json();
  
  // 处理不同的响应格式
  if (result.choices && result.choices[0]) {
    if (result.choices[0].message) {
      return result.choices[0].message.content;
    } else if (result.choices[0].text) {
      return result.choices[0].text;
    }
  }
  
  throw new Error('Unexpected API response format');
};

const evaluateExample = async (prompt, modelId, modelType) => {
  try {
    console.log('Evaluating example with prompt:', prompt);
    console.log('Model type:', modelType);
    
    const collectionName = modelType === 'Large Language' ? 'language-models' : 'multimodal-models';
    console.log('Using collection:', collectionName);
    
    const modelDoc = await db.collection(collectionName).doc(modelId).get();

    if (!modelDoc.exists) {
      throw new Error(`Model not found in collection ${collectionName} with id ${modelId}`);
    }

    const model = modelDoc.data();
    console.log('Model configuration:', {
      ...model,
      api_token: '***' // 隐藏 token
    });

    return await callModelAPI(model, prompt);
  } catch (error) {
    console.error('Error in evaluateExample:', error);
    throw error;
  }
};

module.exports = {
  evaluateExample,
  buildPrompt
}; 