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

  // All setups are the same - no trial mode

  console.log(chalk.blue('🚀 Initializing EasyAI...'));

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

  // Setup Python and Node.js modules so they work from anywhere
  await setupPythonModule(easyaiDir);
  await setupNodeModule(easyaiDir);

  // Setup simple import-based monitoring
  await setupSimpleMonitoring(easyaiDir);

  console.log(chalk.green('✅ EasyAI initialized successfully!'));
  
  console.log(chalk.yellow('💡 Next steps:'));
  console.log(chalk.yellow('   1. Add your API keys to easyai/config/easyai.env'));
  console.log(chalk.yellow('   2. Add import to your code:'));
  console.log(chalk.green('      Python: import easyai  # Add this line at top'));
  console.log(chalk.green('      Node.js: require("easyai")  # Add this line at top'));
  console.log(chalk.yellow('   3. Run your code normally - full content captured!'));
  console.log(chalk.yellow('   4. View dashboard: easyai ui'));
  console.log(chalk.gray(''));
  console.log(chalk.cyan('✨ Simple, reliable monitoring - just one import line!'));
}

async function createExamplePrompts(easyaiDir: string): Promise<void> {
  const examplesDir = path.join(easyaiDir, 'prompts', 'examples');
  
  // Ensure the examples directory exists
  await fs.ensureDir(examplesDir);

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
  
  console.log(chalk.green('📁 Created example prompt templates in easyai/prompts/examples/'));
}

async function createSetupInstructions(easyaiDir: string): Promise<void> {
  const instructionsPath = path.join(easyaiDir, 'setup-instructions.md');
  
  const instructions = `# EasyAI Auto-Capture Setup

## Quick Start

### Python
Add this line to the **top** of your Python files:
\`\`\`python
import easyai
\`\`\`

Example:
\`\`\`python
import easyai  # Add this line!
import requests

response = requests.post('https://api.openai.com/v1/chat/completions', 
    headers={'Authorization': f'Bearer {api_key}'},
    json={'model': 'gpt-3.5-turbo', 'messages': [...]})
# Request/response automatically logged to easyai/logs/calls.jsonl
\`\`\`

### Node.js
Add this line to the **top** of your JavaScript/TypeScript files:
\`\`\`javascript
require('easyai');
\`\`\`

Example:
\`\`\`javascript
require('easyai');  // Add this line!
const axios = require('axios');

const response = await axios.post('https://api.openai.com/v1/chat/completions', {
  model: 'gpt-3.5-turbo',
  messages: [...]
}, {
  headers: { 'Authorization': \`Bearer \${apiKey}\` }
});
// Request/response automatically logged to easyai/logs/calls.jsonl
\`\`\`

## What Gets Captured

- ✅ **Full request bodies** (JSON data sent to APIs)
- ✅ **Complete response data** (API responses)
- ✅ **Headers and metadata**
- ✅ **Timing and performance metrics**
- ✅ **Cost calculations**
- ✅ **Error information**

## View Captured Data

- **Dashboard**: Run \`easyai ui\` to view in browser
- **Log files**: Check \`easyai/logs/calls.jsonl\` for raw data

## Supported APIs

- OpenAI (GPT models)
- Anthropic (Claude)
- Google (Gemini)
- OpenRouter
- Any HTTP/HTTPS API requests

---
*Generated by EasyAI CLI*
`;

  await fs.writeFile(instructionsPath, instructions);
  console.log(chalk.green('📝 Created setup instructions: easyai/setup-instructions.md'));
}


async function createConfigFiles(easyaiDir: string, userId?: string): Promise<void> {
  const configDir = path.join(easyaiDir, 'config');
  
  // Create environment configuration
  const envContent = `# OpenAI Configuration
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

  await fs.writeFile(path.join(configDir, 'easyai.env'), envContent);

  // Create settings.json with minimal configuration
  const settings = {
    ui: {
      theme: 'dark'
    },
    logging: {
      enabled: true,
      includeResponses: true
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
  
  // Note: analytics.json is no longer needed - analytics are calculated directly from log files
}




async function setupPythonModule(easyaiDir: string): Promise<void> {
  try {
    // Get the path to the globally installed package
    const packageRoot = path.dirname(require.resolve('@easyai/cli/package.json'));
    const projectRoot = path.dirname(easyaiDir);
    
    // Create a local easyai.py file that imports from the global package
    const localEasyAiPath = path.join(projectRoot, 'easyai.py');
    
    const easyaiContent = `"""
EasyAI - Simple Auto-Capture for AI API Monitoring

Just import this module to automatically start logging AI API requests:
    import easyai

All requests to AI providers will be automatically logged to easyai/logs/calls.jsonl
"""

import os
import sys

# Only initialize once
if not hasattr(sys, '_easyai_initialized'):
    sys._easyai_initialized = True
    
    try:
        # Try to find the globally installed easyai package
        import subprocess
        import importlib.util
        
        # Get the npm global package location
        try:
            result = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                npm_global_root = result.stdout.strip()
                interceptor_path = os.path.join(npm_global_root, '@easyai', 'cli', 'scripts', 'python', 'easyai_interceptor.py')
                
                if os.path.exists(interceptor_path):
                    # Load the interceptor module dynamically
                    spec = importlib.util.spec_from_file_location("easyai_interceptor", interceptor_path)
                    if spec and spec.loader:
                        interceptor_module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(interceptor_module)
                        print("[EasyAI] Auto-capture initialized - all AI API requests will be logged")
                    else:
                        raise ImportError("Could not load interceptor spec")
                else:
                    raise ImportError(f"Interceptor not found at {interceptor_path}")
            else:
                raise ImportError("Could not find npm global root")
                
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError, FileNotFoundError):
            # Fallback: try common global npm locations
            possible_locations = [
                '/usr/local/lib/node_modules/@easyai/cli/scripts/python/easyai_interceptor.py',
                '/opt/homebrew/lib/node_modules/@easyai/cli/scripts/python/easyai_interceptor.py',
                os.path.expanduser('~/.npm-global/lib/node_modules/@easyai/cli/scripts/python/easyai_interceptor.py'),
            ]
            
            interceptor_loaded = False
            for interceptor_path in possible_locations:
                if os.path.exists(interceptor_path):
                    spec = importlib.util.spec_from_file_location("easyai_interceptor", interceptor_path)
                    if spec and spec.loader:
                        interceptor_module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(interceptor_module)
                        print("[EasyAI] Auto-capture initialized - all AI API requests will be logged")
                        interceptor_loaded = True
                        break
            
            if not interceptor_loaded:
                raise ImportError("Could not find EasyAI interceptor in any expected location")
                
    except Exception as e:
        print(f"[EasyAI] Warning: Could not initialize auto-capture: {e}")
        print("[EasyAI] Make sure @easyai/cli is installed globally: npm install -g @easyai/cli")

# Version info
__version__ = "3.0.23"
`;

    await fs.writeFile(localEasyAiPath, easyaiContent);
    console.log(chalk.green('📄 Created local easyai.py module'));
    
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not create local easyai.py module'));
  }
}

async function setupNodeModule(easyaiDir: string): Promise<void> {
  try {
    const projectRoot = path.dirname(easyaiDir);
    
    // Create package.json if it doesn't exist
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      const basicPackageJson = {
        name: path.basename(projectRoot),
        version: '1.0.0',
        description: '',
        main: 'index.js',
        scripts: {
          test: 'echo "Error: no test specified" && exit 1'
        },
        keywords: [],
        author: '',
        license: 'ISC'
      };
      await fs.writeJSON(packageJsonPath, basicPackageJson, { spaces: 2 });
    }
    
    // Create local node_modules/easyai directory with the auto-capture module
    const nodeModulesDir = path.join(projectRoot, 'node_modules', 'easyai');
    await fs.ensureDir(nodeModulesDir);
    
    // Get the global package location and copy auto-capture files
    const packageRoot = path.dirname(require.resolve('@easyai/cli/package.json'));
    
    // Copy the compiled auto-capture and pricing modules
    const autoCaptureSource = path.join(packageRoot, 'dist', 'utils', 'auto-capture.js');
    const pricingSource = path.join(packageRoot, 'dist', 'utils', 'pricing.js');
    
    if (await fs.pathExists(autoCaptureSource) && await fs.pathExists(pricingSource)) {
      await fs.copy(autoCaptureSource, path.join(nodeModulesDir, 'auto-capture.js'));
      await fs.copy(pricingSource, path.join(nodeModulesDir, 'pricing.js'));
      
      // Create index.js that exports the auto-capture module
      const indexContent = `module.exports = require('./auto-capture.js');`;
      await fs.writeFile(path.join(nodeModulesDir, 'index.js'), indexContent);
      
      // Create package.json for the local module
      const modulePackageJson = {
        name: 'easyai',
        version: '3.0.23',
        description: 'EasyAI auto-capture module',
        main: 'index.js'
      };
      await fs.writeJSON(path.join(nodeModulesDir, 'package.json'), modulePackageJson, { spaces: 2 });
      
      console.log(chalk.green('📦 Created local Node.js easyai module'));
    }
    
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not create local Node.js easyai module'));
  }
}

async function setupSimpleMonitoring(easyaiDir: string): Promise<boolean> {
  console.log('\n' + chalk.cyan('🌐 EasyAI Auto-Capture Setup'));
  console.log(chalk.gray('Setting up simple import-based monitoring for Python and Node.js'));
  
  // Create setup instructions
  await createSetupInstructions(easyaiDir);
  
  console.log(chalk.green('✅ Auto-capture configured!'));
  console.log(chalk.cyan('\n🎉 Simple monitoring is now ready!'));
  console.log(chalk.green('   ✅ Full request/response capture for Python & Node.js'));
  console.log(chalk.green('   ✅ Just add one import line to your code'));
  console.log(chalk.green('   ✅ Automatic logging to easyai/logs/calls.jsonl'));
  
  return true;
}
