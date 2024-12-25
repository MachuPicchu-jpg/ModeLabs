import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// 分类任务可视化
const ClassificationMetrics = ({ metrics }) => {
  const data = Object.entries(metrics)
    .filter(([key]) => key !== 'accuracy')
    .map(([key, value]) => ({
      name: key.replace(/(precision|recall|f1)_/, ''),
      precision: key.startsWith('precision_') ? value : null,
      recall: key.startsWith('recall_') ? value : null,
      f1: key.startsWith('f1_') ? value : null
    }))
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.name);
      if (existing) {
        return acc.map(item => item.name === curr.name
          ? { ...item, ...curr }
          : item
        );
      }
      return [...acc, curr];
    }, []);

  return (
    <div className="space-y-6">
      {/* 总体准确率 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">总体准确率</h3>
        <div className="text-3xl font-bold text-blue-600">
          {(metrics.accuracy * 100).toFixed(1)}%
        </div>
      </div>

      {/* 分类指标对比 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">分类指标对比</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="precision" name="精确率" fill="#8884d8" />
              <Bar dataKey="recall" name="召回率" fill="#82ca9d" />
              <Bar dataKey="f1" name="F1分数" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 生成任务可视化
const GenerationMetrics = ({ metrics }) => {
  const data = [
    { name: 'BLEU', value: metrics.bleu },
    { name: 'ROUGE-P', value: metrics.rouge_precision },
    { name: 'ROUGE-R', value: metrics.rouge_recall },
    { name: 'ROUGE-F1', value: metrics.rouge_f1 }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">生成指标</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis domain={[0, 1]} />
            <Radar
              name="指标值"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 问答任务可视化
const QAMetrics = ({ metrics }) => {
  const data = [
    { name: 'F1分数', value: metrics.f1 },
    { name: '精确匹配率', value: metrics.exact_match }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">问答指标</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Bar dataKey="value" name="指标值" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 对话任务可视化
const DialogueMetrics = ({ metrics }) => {
  const data = [
    { name: '回应适当性', value: metrics.response_appropriateness },
    { name: '连贯性', value: metrics.coherence },
    { name: '参与度', value: metrics.engagement }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">对话指标</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis domain={[0, 1]} />
            <Radar
              name="指标值"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 回归任务可视化
const RegressionMetrics = ({ metrics, results }) => {
  // 准备散点图数据
  const scatterData = results.map((r, index) => ({
    name: `样本${index + 1}`,
    actual: parseFloat(r.groundTruth.target || r.groundTruth.value),
    predicted: parseFloat(r.prediction)
  }));

  return (
    <div className="space-y-6">
      {/* 误差指标 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-900 mb-2">MSE</h3>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.mse.toFixed(4)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-900 mb-2">MAE</h3>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.mae.toFixed(4)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-900 mb-2">RMSE</h3>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.rmse.toFixed(4)}
          </div>
        </div>
      </div>

      {/* 预测vs实际值散点图 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">预测值 vs 实际值</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                name="实际值"
                stroke="#8884d8"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="预测值"
                stroke="#82ca9d"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 结果列表
const ResultsList = ({ results, taskType }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">评测结果详情</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  样本ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  输入
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  预测
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  实际值
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.sampleId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.sampleId + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {JSON.stringify(result.input)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {result.prediction}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {taskType === 'classification'
                      ? result.groundTruth.label || result.groundTruth.category || result.groundTruth.class
                      : taskType === 'qa'
                      ? result.groundTruth.answer
                      : taskType === 'generation'
                      ? result.groundTruth.completion || result.groundTruth.target
                      : taskType === 'dialogue'
                      ? result.groundTruth.response
                      : result.groundTruth.target || result.groundTruth.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const EvaluationResults = ({ taskType, metrics, results }) => {
  return (
    <div className="space-y-8">
      {/* 指标可视化 */}
      <div>
        {taskType === 'classification' && <ClassificationMetrics metrics={metrics} />}
        {taskType === 'generation' && <GenerationMetrics metrics={metrics} />}
        {taskType === 'qa' && <QAMetrics metrics={metrics} />}
        {taskType === 'dialogue' && <DialogueMetrics metrics={metrics} />}
        {taskType === 'regression' && <RegressionMetrics metrics={metrics} results={results} />}
      </div>

      {/* 结果列表 */}
      <ResultsList results={results} taskType={taskType} />
    </div>
  );
};

export default EvaluationResults; 