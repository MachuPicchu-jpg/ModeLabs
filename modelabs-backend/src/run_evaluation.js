require('dotenv').config();
const { evaluateAllModels } = require('./services/evaluation_service');

async function main() {
    try {
        console.log('\nStarting automatic model evaluation system...');
        
        // Run evaluation periodically
        while (true) {
            try {
                await evaluateAllModels();
                console.log('\nWaiting for 5 minutes before next evaluation check...');
                await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // Wait 5 minutes
            } catch (error) {
                console.error('\nError during evaluation:', error);
                console.log('\nRetrying in 1 minute...');
                await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // Wait 1 minute before retry
            }
        }
    } catch (error) {
        console.error('\nCritical error in main loop:', error);
        process.exit(1);
    }
}

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\nEvaluation system shutting down...');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('\nUncaught exception:', error);
    console.log('System will continue running...');
});

if (require.main === module) {
    main();
} 