import React, { useState, useEffect } from 'react';
import './ModelTest.css';

const ModelTest = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newModel, setNewModel] = useState({
    name: '',
    type: 'text',
    description: ''
  });

  // 获取模型列表
  const fetchModels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/models');

      const data = await response.json();
      console.log('Fetched data:', data); // 添加调试日志

      setModels(data);
    } catch (err) {
      console.error('Fetch error:', err); // 添加错误日志

      setError(err.message || 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  // 添加新模型
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModel),
      });
      if (!response.ok) {
        throw new Error('Failed to add model');
      }
      setNewModel({
        name: '',
        type: 'text',
        description: ''
      });
      await fetchModels();
    } catch (err) {
      setError(err.message || 'Failed to add model');
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="model-test-container">
      <h1>Model Testing</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newModel.name}
            onChange={(e) => setNewModel({...newModel, name: e.target.value})}
          />
        </div>
        <div>
          <label>Type:</label>
          <select
            value={newModel.type}
            onChange={(e) => setNewModel({...newModel, type: e.target.value})}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={newModel.description}
            onChange={(e) => setNewModel({...newModel, description: e.target.value})}
          />
        </div>
        <button type="submit">Add Model</button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="models-list">
          {models.map((model) => (
            <div key={model.id} className="model-item">
              <h3>{model.name}</h3>
              <p>Type: {model.type}</p>
              <p>{model.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelTest;