import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Navbar from '../components/Navbar';

const EvaluationResult = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching tasks...');
      
      const response = await fetch('http://localhost:3001/api/evaluation/tasks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      
      if (data.success) {
        setTasks(data.tasks || []);
      } else {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // 设置轮询间隔
    const interval = setInterval(() => {
      const hasRunningTasks = tasks.some(task => task.status === 'running' || task.status === 'pending');
      if (hasRunningTasks) {
        console.log('Polling for task updates...');
        fetchTasks();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []); // 移除 taskId 依赖

  const renderMetricsChart = (metrics) => {
    if (!metrics) return null;

    const data = Object.entries(metrics).map(([key, value]) => ({
      name: key,
      value: typeof value === 'number' ? value : 0
    }));

    return (
      <Box sx={{ width: '100%', height: 300, mt: 2 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderTaskCard = (task) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed':
          return 'success';
        case 'running':
          return 'warning';
        case 'failed':
          return 'error';
        case 'pending':
          return 'info';
        default:
          return 'default';
      }
    };

    return (
      <Card key={task.id} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom>
                  评测任务 {task.id}
                </Typography>
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
                  sx={{ ml: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                任务类型: {task.taskType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                数据集格式: {task.datasetFormat}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                创建时间: {new Date(task.createdAt).toLocaleString()}
              </Typography>
            </Grid>
            {(task.status === 'running' || task.status === 'pending') && (
              <Grid item xs={12}>
                <LinearProgress sx={{ mt: 2 }} />
              </Grid>
            )}
            {task.status === 'failed' && task.error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {task.error}
                </Alert>
              </Grid>
            )}
            {task.status === 'completed' && task.results && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  评测结果
                </Typography>
                {renderMetricsChart(task.results.metrics)}
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>指标</TableCell>
                        <TableCell align="right">值</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(task.results.metrics || {}).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row">
                            {key}
                          </TableCell>
                          <TableCell align="right">
                            {typeof value === 'number' ? value.toFixed(4) : value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <Typography variant="h4" component="h1" gutterBottom>
            评测任务列表
          </Typography>
          
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && tasks.length === 0 && (
            <Alert severity="info">
              暂无评测任务
            </Alert>
          )}

          {!loading && !error && tasks.length > 0 && (
            <Box sx={{ mt: 3 }}>
              {tasks.map(task => renderTaskCard(task))}
            </Box>
          )}
        </div>
      </main>
    </div>
  );
};

export default EvaluationResult; 