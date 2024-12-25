const calculateAccuracy = (predictions, groundTruth) => {
  const correct = predictions.filter((pred, i) => pred === groundTruth[i]).length;
  return correct / predictions.length;
};

const calculatePrecisionRecallF1 = (predictions, groundTruth, labels) => {
  const metrics = {};
  
  labels.forEach(label => {
    let tp = 0, fp = 0, fn = 0;
    
    predictions.forEach((pred, i) => {
      if (pred === label && groundTruth[i] === label) tp++;
      else if (pred === label && groundTruth[i] !== label) fp++;
      else if (pred !== label && groundTruth[i] === label) fn++;
    });
    
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1 = 2 * (precision * recall) / (precision + recall) || 0;
    
    metrics[`precision_${label}`] = precision;
    metrics[`recall_${label}`] = recall;
    metrics[`f1_${label}`] = f1;
  });
  
  return metrics;
};

const calculateBLEU = (prediction, reference) => {
  // 处理undefined或null的情况
  if (!prediction || !reference) {
    console.warn('Undefined or null input in BLEU calculation');
    return 0;
  }

  // 确保输入是字符串
  const predStr = String(prediction);
  const refStr = String(reference);
  
  // 简化版BLEU计算
  const predTokens = predStr.toLowerCase().split(/\s+/);
  const refTokens = refStr.toLowerCase().split(/\s+/);
  
  // 处理空字符串的情况
  if (predTokens.length === 0) {
    return 0;
  }
  
  let matches = 0;
  predTokens.forEach(token => {
    if (refTokens.includes(token)) matches++;
  });
  
  return matches / predTokens.length;
};

const calculateROUGE = (prediction, reference) => {
  const predTokens = prediction.toLowerCase().split(/\s+/);
  const refTokens = reference.toLowerCase().split(/\s+/);
  
  let matches = 0;
  predTokens.forEach(token => {
    if (refTokens.includes(token)) matches++;
  });
  
  const precision = matches / predTokens.length;
  const recall = matches / refTokens.length;
  const f1 = 2 * (precision * recall) / (precision + recall) || 0;
  
  return {
    precision,
    recall,
    f1
  };
};

const calculateRegressionMetrics = (predictions, groundTruth) => {
  const n = predictions.length;
  let mse = 0;
  let mae = 0;
  
  predictions.forEach((pred, i) => {
    const diff = pred - groundTruth[i];
    mse += diff * diff;
    mae += Math.abs(diff);
  });
  
  mse /= n;
  mae /= n;
  
  return {
    mse,
    mae,
    rmse: Math.sqrt(mse)
  };
};

const evaluateResults = (results, taskType) => {
  const predictions = results.map(r => r.prediction);
  const groundTruth = results.map(r => {
    if (taskType === 'classification') {
      return r.groundTruth.label || r.groundTruth.category || r.groundTruth.class;
    } else if (taskType === 'qa') {
      return r.groundTruth.answer;
    } else if (taskType === 'generation') {
      return r.groundTruth.completion || r.groundTruth.target;
    } else if (taskType === 'dialogue') {
      return r.groundTruth.response;
    } else {
      return r.groundTruth.target || r.groundTruth.value;
    }
  });

  switch (taskType) {
    case 'classification': {
      const labels = [...new Set(groundTruth)];
      return {
        accuracy: calculateAccuracy(predictions, groundTruth),
        ...calculatePrecisionRecallF1(predictions, groundTruth, labels)
      };
    }
    
    case 'generation': {
      const bleuScores = predictions.map((pred, i) => 
        calculateBLEU(pred, groundTruth[i])
      );
      const rougeScores = predictions.map((pred, i) => 
        calculateROUGE(pred, groundTruth[i])
      );
      
      return {
        bleu: bleuScores.reduce((a, b) => a + b, 0) / bleuScores.length,
        rouge_precision: rougeScores.reduce((a, b) => a + b.precision, 0) / rougeScores.length,
        rouge_recall: rougeScores.reduce((a, b) => a + b.recall, 0) / rougeScores.length,
        rouge_f1: rougeScores.reduce((a, b) => a + b.f1, 0) / rougeScores.length
      };
    }
    
    case 'qa': {
      const exactMatches = predictions.filter((pred, i) => 
        pred.toLowerCase().trim() === groundTruth[i].toLowerCase().trim()
      ).length;
      
      const rougeScores = predictions.map((pred, i) => 
        calculateROUGE(pred, groundTruth[i])
      );
      
      return {
        exact_match: exactMatches / predictions.length,
        f1: rougeScores.reduce((a, b) => a + b.f1, 0) / rougeScores.length
      };
    }
    
    case 'dialogue': {
      // 对话评估指标（示例）
      return {
        response_appropriateness: 0.8, // 这里需要更复杂的评估逻辑
        coherence: 0.7,
        engagement: 0.75
      };
    }
    
    case 'regression': {
      const numericPredictions = predictions.map(p => parseFloat(p));
      const numericGroundTruth = groundTruth.map(g => parseFloat(g));
      return calculateRegressionMetrics(numericPredictions, numericGroundTruth);
    }
    
    default:
      return {};
  }
};

module.exports = {
  evaluateResults
}; 