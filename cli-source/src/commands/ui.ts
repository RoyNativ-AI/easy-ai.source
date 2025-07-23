import chalk from 'chalk';
import { exec } from 'child_process';
import { checkEasyAIExists } from '../utils/helpers';
import { startServer } from '../server';

async function killProcessOnPort(port: number): Promise<void> {
  return new Promise((resolve) => {
    // Find and kill process using the port
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        // No process found on port, continue
        resolve();
        return;
      }
      
      const pid = stdout.trim();
      console.log(chalk.yellow(`🔄 Stopping existing process on port ${port} (PID: ${pid})...`));
      
      exec(`kill -9 ${pid}`, (killError) => {
        if (killError) {
          console.log(chalk.yellow(`⚠️  Could not stop process ${pid}, continuing anyway...`));
        } else {
          console.log(chalk.green(`✅ Stopped existing process on port ${port}`));
        }
        resolve();
      });
    });
  });
}

export async function startUI(port: number = 7542): Promise<void> {
  const projectDir = process.cwd();
  
  // Check if EasyAI is initialized
  if (!await checkEasyAIExists(projectDir)) {
    throw new Error('EasyAI not initialized. Run "easyai init" first.');
  }

  // Kill any existing process on the port
  await killProcessOnPort(port);
  
  // Wait a moment for the port to be freed
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(chalk.green('🎯 Starting EasyAI Dashboard...'));
  console.log(chalk.blue(`📱 Will open: http://localhost:${port}`));
  console.log(chalk.gray('Press Ctrl+C to stop'));

  // Set port in environment
  process.env.EASYAI_PORT = port.toString();

  // Start the TypeScript server
  startServer();

  // Open browser after a short delay to ensure server is ready
  setTimeout(() => {
    const url = `http://localhost:${port}`;
    console.log(chalk.blue(`🌐 Opening browser: ${url}`));
    
    // Cross-platform browser opening
    const command = process.platform === 'darwin' ? 'open' : 
                   process.platform === 'win32' ? 'start' : 'xdg-open';
    
    exec(`${command} ${url}`, (error) => {
      if (error) {
        console.log(chalk.yellow(`⚠️  Could not open browser automatically. Please visit: ${url}`));
      } else {
        console.log(chalk.green('✅ Browser opened successfully'));
      }
    });
  }, 2000); // 2 second delay to ensure server is ready

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n👋 Shutting down EasyAI Dashboard...'));
    console.log(chalk.green('✅ Dashboard stopped'));
    process.exit(0);
  });

  return new Promise(() => {
    // Keep the process running
  });
}