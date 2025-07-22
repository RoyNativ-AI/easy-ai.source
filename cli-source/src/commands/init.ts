import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { generateId } from '../utils/helpers';

export async function initializeProject(userId?: string): Promise<void> {
  const projectDir = process.cwd();
  const easyaiDir = path.join(projectDir, 'easyai');

  // Check if already initialized
  if (await fs.pathExists(easyaiDir)) {
    throw new Error('EasyAI is already initialized in this project');
  }

  // Check if this is a trial setup
  const isTrialSetup = userId && userId.startsWith('easyai_');

  console.log(chalk.blue('🚀 Initializing EasyAI...'));
  if (isTrialSetup) {
    console.log(chalk.cyan('🎯 Trial mode detected - setting up demo configuration'));
  }

  // Create directory structure
  await fs.ensureDir(path.join(easyaiDir, 'prompts', 'examples'));
  await fs.ensureDir(path.join(easyaiDir, 'logs'));
  await fs.ensureDir(path.join(easyaiDir, 'config'));
  await fs.ensureDir(path.join(easyaiDir, 'cache'));

  // Create example prompts
  await createExamplePrompts(easyaiDir);

  // Create configuration files
  await createConfigFiles(easyaiDir, userId);

  // Create initial log files
  await createLogFiles(easyaiDir);

  // Setup auto-capture logging
  const autoCaptureEnabled = await setupAutoCapture(projectDir);

  console.log(chalk.green('📁 Created folder structure'));
  console.log(chalk.green('📝 Created example prompts'));
  console.log(chalk.green('⚙️  Created configuration files'));
  
  if (autoCaptureEnabled) {
    console.log(chalk.green('🔍 Auto-capture logging enabled'));
  }
  
  console.log(chalk.yellow('💡 Next steps:'));
  
  if (isTrialSetup) {
    console.log(chalk.cyan('   🎉 You\'re ready to try EasyAI!'));
    console.log(chalk.cyan('   1. Run "easyai ui" to open the dashboard'));
    console.log(chalk.cyan('   2. Test the playground with demo models'));
    if (autoCaptureEnabled) {
      console.log(chalk.cyan('   3. Run your app with: node easyai-start.js (auto-capture enabled)'));
    }
    console.log(chalk.yellow('   💡 To unlock full features, add your own API keys to easyai/config/easyai.env'));
  } else {
    console.log(chalk.yellow('   1. Add your API keys to easyai/config/easyai.env'));
    if (autoCaptureEnabled) {
      console.log(chalk.yellow('   2. Run your app with: node easyai-start.js'));
      console.log(chalk.yellow('   3. Run "easyai ui" to open the dashboard and view logs'));
    } else {
      console.log(chalk.yellow('   2. Add import \'easyai/auto-capture\' to your main file for manual logging'));
      console.log(chalk.yellow('   3. Run "easyai ui" to open the dashboard'));
    }
  }
}

async function createExamplePrompts(easyaiDir: string): Promise<void> {
  const examplesDir = path.join(easyaiDir, 'prompts', 'examples');

  await fs.writeFile(
    path.join(examplesDir, 'code-review.md'),
    `# Code Review Prompt

## Task
Review the following code for:
- Code quality and best practices
- Security vulnerabilities
- Performance issues
- Maintainability

## Input
\`\`\`{{language}}
{{code}}
\`\`\`

## Output Format
Provide structured feedback with specific suggestions for improvement.`
  );

  await fs.writeFile(
    path.join(examplesDir, 'bug-fix.md'),
    `# Bug Fix Prompt

## Task
Analyze the following code and identify potential bugs:

## Code
\`\`\`{{language}}
{{code}}
\`\`\`

## Error/Issue
{{error_description}}

## Expected Output
1. Root cause analysis
2. Proposed fix with explanation
3. Prevention strategies`
  );

  await fs.writeFile(
    path.join(examplesDir, 'feature-request.md'),
    `# Feature Implementation Prompt

## Feature Description
{{feature_description}}

## Requirements
{{requirements}}

## Existing Code Context
\`\`\`{{language}}
{{existing_code}}
\`\`\`

## Output
Provide implementation plan and code for the requested feature.`
  );
}

async function createConfigFiles(easyaiDir: string, userId?: string): Promise<void> {
  const configDir = path.join(easyaiDir, 'config');
  
  // Check if user provided a customer key (trial setup)
  const isTrialSetup = userId && userId.startsWith('easyai_');
  
  // Create .env file with demo keys if trial setup
  let envContent = '';
  
  if (isTrialSetup) {
    envContent = `# EasyAI Trial Configuration
# You're using EasyAI trial with limited access
# To unlock full features, add your own API keys below

# OpenAI Configuration (Demo - Limited)
OPENAI_API_KEY=demo_openai_key

# Anthropic Configuration (Demo - Limited)
ANTHROPIC_API_KEY=demo_anthropic_key

# Google Gemini Configuration  
GOOGLE_API_KEY=

# OpenRouter Configuration
OPENROUTER_API_KEY=

# Ollama Configuration
OLLAMA_BASE_URL=

# EasyAI Configuration
EASYAI_USER_ID=${userId}
EASYAI_PROJECT_ID=${generateId()}
EASYAI_LOG_LEVEL=info
EASYAI_PORT=7542
EASYAI_TRIAL_MODE=true
`;
  } else {
    envContent = `# OpenAI Configuration
OPENAI_API_KEY=

# Anthropic Configuration  
ANTHROPIC_API_KEY=

# Google Gemini Configuration
GOOGLE_API_KEY=

# OpenRouter Configuration
OPENROUTER_API_KEY=

# Ollama Configuration
OLLAMA_BASE_URL=

# EasyAI Configuration
EASYAI_USER_ID=${userId || generateId()}
EASYAI_PROJECT_ID=${generateId()}
EASYAI_LOG_LEVEL=info
EASYAI_PORT=7542
`;
  }

  await fs.writeFile(path.join(configDir, 'easyai.env'), envContent);

  // Create settings.json
  const settings = {
    ui: {
      theme: 'dark',
      autoSave: true
    },
    models: {
      openai: 'gpt-4',
      anthropic: 'claude-3-sonnet',
      default: 'gpt-4'
    },
    logging: {
      enabled: true,
      includeResponses: true,
      retention: '30d'
    },
    prompts: {
      autoBackup: true,
      validateSyntax: true
    }
  };

  await fs.writeJSON(path.join(configDir, 'settings.json'), settings, { spaces: 2 });
}

async function createLogFiles(easyaiDir: string): Promise<void> {
  const logsDir = path.join(easyaiDir, 'logs');
  const configDir = path.join(easyaiDir, 'config');

  // Create empty log files
  await fs.writeFile(path.join(logsDir, 'calls.jsonl'), '');
  
  // Create legacy log file in config (for compatibility)
  await fs.writeFile(path.join(configDir, 'easyai.jsonl'), '');
  
  // Create auto-capture log file
  await fs.writeFile(path.join(logsDir, 'auto-capture.jsonl'), '');
  
  // Note: analytics.json is no longer needed - analytics are calculated directly from log files
}

async function setupAutoCapture(projectDir: string): Promise<boolean> {
  console.log('\n' + chalk.cyan('🧵 EasyAI Auto-Capture Setup'));
  console.log(chalk.gray('Auto-capture can automatically log HTTP requests (axios/fetch) without code changes.'));
  
  const { enableAutoCapture } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'enableAutoCapture',
      message: 'Enable automatic API logging?',
      default: true
    }
  ]);

  if (enableAutoCapture) {
    // Detect main entry file
    const entryFile = await detectEntryFile(projectDir);
    
    if (entryFile) {
      console.log(chalk.gray(`📁 Detected entry file: ${entryFile}`));
      await createWrapperFile(projectDir, entryFile);
      console.log(chalk.green('✅ Created wrapper file: easyai-start.js'));
      
      console.log(chalk.cyan('\n📦 Auto-capture logging is now enabled!'));
      console.log(chalk.gray('▶  Run your app with: node easyai-start.js'));
      console.log(chalk.gray('⚙️  Prefer manual control? Add: require(\'easyai/auto-capture\') to your entry file'));
      
      return true;
    } else {
      console.log(chalk.yellow('⚠️  Could not detect main entry file'));
      await createManualInstructions(projectDir);
      return false;
    }
  } else {
    console.log(chalk.gray('⚙️  Auto-capture disabled. You can enable it later by adding:'));
    console.log(chalk.gray('   require(\'easyai/auto-capture\')'));
    console.log(chalk.gray('   to your main application file.'));
    return false;
  }
}

async function detectEntryFile(projectDir: string): Promise<string | null> {
  // Check package.json main field
  const packageJsonPath = path.join(projectDir, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJSON(packageJsonPath);
      if (packageJson.main) {
        const mainFile = packageJson.main;
        if (await fs.pathExists(path.join(projectDir, mainFile))) {
          return mainFile;
        }
      }
    } catch (error) {
      // Continue with fallback detection
    }
  }

  // Common entry file patterns
  const commonEntries = [
    'index.js',
    'app.js',
    'server.js',
    'main.js',
    'src/index.js',
    'src/app.js',
    'src/server.js',
    'src/main.js',
    'dist/index.js',
    'build/index.js'
  ];

  for (const entry of commonEntries) {
    if (await fs.pathExists(path.join(projectDir, entry))) {
      return entry;
    }
  }

  return null;
}

async function createWrapperFile(projectDir: string, entryFile: string): Promise<void> {
  const wrapperPath = path.join(projectDir, 'easyai-start.js');
  
  const wrapperContent = `#!/usr/bin/env node

/**
 * EasyAI Auto-Capture Wrapper
 * 
 * This file automatically enables EasyAI's API logging without requiring
 * any changes to your application code.
 * 
 * Generated by: easyai init
 * Entry file: ${entryFile}
 * 
 * To disable auto-capture and use manual import instead:
 * 1. Delete this file
 * 2. Add require('easyai/auto-capture') to your main application file
 */

console.log('🚀 Starting application with EasyAI auto-capture...');

// Enable EasyAI auto-capture interceptors
try {
  require('easyai/auto-capture');
} catch (error) {
  console.warn('⚠️  EasyAI auto-capture not found. Make sure easyai is installed.');
}

// Start the original application
require('./${entryFile}');
`;

  await fs.writeFile(wrapperPath, wrapperContent);
  
  // Make it executable
  try {
    await fs.chmod(wrapperPath, 0o755);
  } catch (error) {
    // Permissions not supported on this system, ignore
  }
}

async function createManualInstructions(projectDir: string): Promise<void> {
  const instructionsPath = path.join(projectDir, 'easyai-setup.md');
  
  const instructions = `# EasyAI Auto-Capture Setup

Since we couldn't automatically detect your main entry file, you can enable auto-capture manually:

## Option 1: Manual Import (Recommended)
Add this line to the **top** of your main application file:
\`\`\`javascript
require('easyai/auto-capture');
\`\`\`

## Option 2: Create Custom Wrapper
Create a wrapper file (e.g., \`start-with-logging.js\`):
\`\`\`javascript
// Enable EasyAI auto-capture
require('easyai/auto-capture');

// Start your application
require('./your-main-file.js');
\`\`\`

Then run: \`node start-with-logging.js\`

## What gets logged?
- All HTTP requests (axios, fetch)
- Request/response data (sensitive data is redacted)
- Performance metrics (duration, status codes)
- Error information

## View logs
Run \`easyai ui\` to view captured requests in the dashboard.

---
Generated by EasyAI CLI
`;

  await fs.writeFile(instructionsPath, instructions);
  console.log(chalk.green('📝 Created setup instructions: easyai-setup.md'));
}