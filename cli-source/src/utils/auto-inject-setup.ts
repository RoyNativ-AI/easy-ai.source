import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';
import { execSync } from 'child_process';

export async function setupAutomaticInterception(easyaiDir: string): Promise<void> {
  console.log(chalk.blue('\n🔧 Setting up automatic interception...'));
  
  // Setup Python auto-injection
  await setupPythonAutoInjection(easyaiDir);
  
  // Setup Node.js auto-injection
  await setupNodeAutoInjection(easyaiDir);
  
  // Create universal launcher script
  await createUniversalLauncher(easyaiDir);
}

async function setupPythonAutoInjection(easyaiDir: string): Promise<void> {
  try {
    // Get Python site-packages directory
    const pythonSitePackages = getPythonSitePackages();
    if (!pythonSitePackages) {
      console.log(chalk.yellow('⚠️  Python not found - skipping Python auto-setup'));
      return;
    }

    // Create sitecustomize.py that auto-loads our interceptor
    const sitecustomizeContent = `# EasyAI Auto-Interceptor
import os
import sys

# Only activate if running from a directory with easyai
if os.path.exists(os.path.join(os.getcwd(), 'easyai')):
    easyai_path = os.path.join(os.getcwd(), 'easyai')
    if easyai_path not in sys.path:
        sys.path.insert(0, easyai_path)
    try:
        import easyai_interceptor
    except:
        pass
`;

    const sitecustomizePath = path.join(pythonSitePackages, 'sitecustomize.py');
    
    // Check if we can write to site-packages
    try {
      await fs.writeFile(sitecustomizePath, sitecustomizeContent);
      console.log(chalk.green('✅ Python auto-interception installed globally'));
    } catch (error) {
      // Fallback: use PYTHONPATH
      const pythonPathScript = path.join(easyaiDir, 'python-path.sh');
      await fs.writeFile(pythonPathScript, `export PYTHONPATH="${easyaiDir}:$PYTHONPATH"`);
      console.log(chalk.yellow('💡 Python: Add to your shell profile: source easyai/python-path.sh'));
    }
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not setup Python auto-injection'));
  }
}

async function setupNodeAutoInjection(easyaiDir: string): Promise<void> {
  try {
    // Create a .env file that sets NODE_OPTIONS
    const envContent = `# EasyAI Node.js Auto-Capture
NODE_OPTIONS="-r ${easyaiDir}/node-preload.js"
`;
    
    await fs.writeFile(path.join(process.cwd(), '.env'), envContent);
    
    // Create the preload script
    const preloadContent = `// EasyAI Node.js Auto-Interceptor
const path = require('path');
const easyaiPath = path.join(process.cwd(), 'easyai', 'auto-capture');
if (require('fs').existsSync(easyaiPath + '.js')) {
  try {
    require(easyaiPath);
  } catch (e) {
    // Silent fail
  }
}
`;
    
    await fs.writeFile(path.join(easyaiDir, 'node-preload.js'), preloadContent);
    
    // Also create auto-capture.js in easyai directory
    const autoCaptureSource = path.join(__dirname, '..', 'auto-capture.js');
    const autoCaptureDest = path.join(easyaiDir, 'auto-capture.js');
    await fs.copy(autoCaptureSource, autoCaptureDest);
    
    console.log(chalk.green('✅ Node.js auto-interception configured'));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not setup Node.js auto-injection'));
  }
}

async function createUniversalLauncher(easyaiDir: string): Promise<void> {
  // Create a universal launcher that detects file type and runs with interception
  const launcherContent = `#!/bin/bash
# EasyAI Universal Launcher - Automatically intercepts all API calls

# Source environment variables
source "${easyaiDir}/config/easyai.env" 2>/dev/null

# Set proxy for languages that can't be intercepted
export HTTP_PROXY=http://127.0.0.1:8888
export HTTPS_PROXY=http://127.0.0.1:8888

# Detect file type and run with appropriate interceptor
FILE="$1"
if [[ "$FILE" == *.py ]]; then
    # Python: Use our wrapper that injects interceptor
    PYTHONPATH="${easyaiDir}:$PYTHONPATH" python3 -c "
import sys
sys.path.insert(0, '${easyaiDir}')
try:
    import easyai_interceptor
except:
    pass
exec(open('$FILE').read())
" "\${@:2}"
elif [[ "$FILE" == *.js ]] || [[ "$FILE" == *.ts ]]; then
    # Node.js: Use NODE_OPTIONS to preload interceptor
    NODE_OPTIONS="-r ${easyaiDir}/node-preload.js" node "$@"
elif [[ "$FILE" == *.rb ]]; then
    # Ruby: Just use proxy for now
    ruby "$@"
elif [[ "$FILE" == *.go ]]; then
    # Go: Just use proxy for now
    go run "$@"
elif [[ "$FILE" == *.java ]]; then
    # Java: Just use proxy for now
    java "$@"
else
    # Unknown: Try to execute as-is
    "$@"
fi
`;

  const launcherPath = path.join(easyaiDir, 'run');
  await fs.writeFile(launcherPath, launcherContent);
  await fs.chmod(launcherPath, 0o755);
  
  console.log(chalk.green('✅ Universal launcher created: easyai/run'));
}

function getPythonSitePackages(): string | null {
  try {
    const result = execSync('python3 -c "import site; print(site.getsitepackages()[0])"', {
      encoding: 'utf8'
    }).trim();
    return result;
  } catch {
    try {
      // Fallback for virtual environments
      const result = execSync('python3 -c "import site; print(site.getusersitepackages())"', {
        encoding: 'utf8'
      }).trim();
      return result;
    } catch {
      return null;
    }
  }
}

export async function createShellAliases(easyaiDir: string): Promise<void> {
  // Create shell aliases that automatically use our interceptors
  const aliasesContent = `# EasyAI Automatic Interception Aliases
# Add this to your ~/.bashrc, ~/.zshrc, or shell profile

# Python alias
alias python3='PYTHONPATH="${easyaiDir}:\$PYTHONPATH" python3 -c "import sys; sys.path.insert(0, \\"${easyaiDir}\\"); try: import easyai_interceptor; except: pass; import runpy; runpy.run_path(sys.argv[1])" '

# Node.js alias  
alias node='NODE_OPTIONS="-r ${easyaiDir}/node-preload.js" node'

# Universal runner
alias run='${easyaiDir}/run'

echo "🚀 EasyAI interception enabled for this shell"
`;

  await fs.writeFile(path.join(easyaiDir, 'shell-aliases.sh'), aliasesContent);
  console.log(chalk.yellow('\n💡 For automatic interception in new terminals:'));
  console.log(chalk.cyan('   Add to ~/.bashrc or ~/.zshrc:'));
  console.log(chalk.green('   source easyai/shell-aliases.sh'));
}