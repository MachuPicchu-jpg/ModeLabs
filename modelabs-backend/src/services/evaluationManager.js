const { spawn } = require('child_process');
const path = require('path');

class EvaluationManager {
    constructor() {
        this.evaluationProcess = null;
    }

    start() {
        const pythonScript = path.join(__dirname, '..', 'run_evaluation.py');
        
        // Start the Python evaluation system
        this.evaluationProcess = spawn('python', [pythonScript], {
            stdio: ['inherit', 'pipe', 'pipe']
        });

        // Handle stdout
        this.evaluationProcess.stdout.on('data', (data) => {
            console.log(`Evaluation System: ${data.toString()}`);
        });

        // Handle stderr
        this.evaluationProcess.stderr.on('data', (data) => {
            console.error(`Evaluation System Error: ${data.toString()}`);
        });

        // Handle process exit
        this.evaluationProcess.on('close', (code) => {
            console.log(`Evaluation system process exited with code ${code}`);
            // Restart the process if it crashes
            if (code !== 0) {
                console.log('Restarting evaluation system...');
                this.start();
            }
        });
    }

    stop() {
        if (this.evaluationProcess) {
            this.evaluationProcess.kill();
            this.evaluationProcess = null;
        }
    }
}

module.exports = new EvaluationManager(); 