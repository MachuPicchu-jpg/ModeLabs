const evaluationManager = require('./services/evaluationManager');

// ... 其他导入

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    
    // 启动评测系统
    evaluationManager.start();
});

// 处理进程退出
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    evaluationManager.stop();
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Shutting down server...');
    evaluationManager.stop();
    process.exit();
}); 