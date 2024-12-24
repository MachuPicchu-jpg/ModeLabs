import { execSync } from 'child_process';
import chalk from 'chalk';

try {
    // 检查 Python 是否安装
    execSync('python --version');
    
    // 检查必要的 Python 包是否安装
    const requiredPackages = [
        'firebase-admin',
        'datasets',
        'tqdm',
        'requests',
        'python-dotenv'
    ];

    console.log(chalk.blue('Checking Python dependencies...'));
    
    for (const pkg of requiredPackages) {
        try {
            execSync(`pip show ${pkg}`, { stdio: 'ignore' });
            console.log(chalk.green(`✓ ${pkg} is installed`));
        } catch (e) {
            console.error(chalk.red(`✗ ${pkg} is not installed`));
            console.log(chalk.yellow(`Installing ${pkg}...`));
            execSync(`pip install ${pkg}`, { stdio: 'inherit' });
        }
    }
    
    console.log(chalk.green('\nAll Python dependencies are ready!'));
} catch (error) {
    console.error(chalk.red('Error: Python is not installed or not in PATH'));
    console.error(chalk.yellow('Please install Python and try again'));
    process.exit(1);
} 