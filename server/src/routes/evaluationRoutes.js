const express = require('express');
const router = express.Router();
const { startEvaluation, getTaskStatus, getAllTasks } = require('../controllers/evaluationController');

// POST /api/evaluation/start
router.post('/start', startEvaluation);

// GET /api/evaluation/task/:taskId
router.get('/task/:taskId', getTaskStatus);

// 获取所有评测任务
router.get('/tasks', getAllTasks);

module.exports = router; 