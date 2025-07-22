import chalk from 'chalk';
import { checkEasyAIExists } from '../utils/helpers';
import { startServer } from '../server';

export async function startUI(port: number = 7542): Promise<void> {
  const projectDir = process.cwd();
  
  // Check if EasyAI is initialized
  if (!await checkEasyAIExists(projectDir)) {
    throw new Error('EasyAI not initialized. Run "easyai init" first.');
  }

  console.log(chalk.green('🎯 Starting EasyAI Dashboard...'));
  console.log(chalk.blue(`📱 Will open: http://localhost:${port}`));
  console.log(chalk.gray('Press Ctrl+C to stop'));

  // Set port in environment
  process.env.EASYAI_PORT = port.toString();

  // Start the TypeScript server
  startServer();

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