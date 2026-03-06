import * as fs from 'fs-extra';
import * as path from 'path';
import { spawn } from 'child_process';

export interface LanguageDetector {
  language: string;
  files: string[];
  command: string;
  interceptorPath?: string;
  setupInstructions?: string;
}

export async function detectProjectLanguages(projectDir: string): Promise<LanguageDetector[]> {
  const detectors: LanguageDetector[] = [];

  // Python detection
  const pythonFiles = ['requirements.txt', 'setup.py', 'pyproject.toml', 'Pipfile', 'poetry.lock'];
  const hasPython = await hasAnyFile(projectDir, pythonFiles) || await hasExtension(projectDir, '.py');
  
  if (hasPython) {
    detectors.push({
      language: 'Python',
      files: pythonFiles,
      command: 'python',
      interceptorPath: 'scripts/python/easyai_interceptor.py',
      setupInstructions: `
# Option 1: Use EasyAI Python wrapper (recommended)
./easyai/easyai-python.sh your_script.py

# Option 2: Add to your Python script:
import sys
sys.path.insert(0, './easyai')
import easyai_interceptor
`
    });
  }

  // Node.js detection
  const nodeFiles = ['package.json', 'yarn.lock', 'package-lock.json'];
  const hasNode = await hasAnyFile(projectDir, nodeFiles) || await hasExtension(projectDir, '.js', '.ts');
  
  if (hasNode) {
    detectors.push({
      language: 'Node.js',
      files: nodeFiles,
      command: 'node',
      setupInstructions: `
# Add to the top of your main JS file:
require('easyai/auto-capture');

# Or use environment variable:
NODE_OPTIONS="-r easyai/auto-capture" node your_app.js
`
    });
  }

  // Ruby detection
  const rubyFiles = ['Gemfile', 'Gemfile.lock', '.ruby-version'];
  const hasRuby = await hasAnyFile(projectDir, rubyFiles) || await hasExtension(projectDir, '.rb');
  
  if (hasRuby) {
    detectors.push({
      language: 'Ruby',
      files: rubyFiles,
      command: 'ruby',
      setupInstructions: `
# Ruby support coming soon!
# For now, HTTP requests will be logged with placeholder data
`
    });
  }

  // Go detection
  const goFiles = ['go.mod', 'go.sum'];
  const hasGo = await hasAnyFile(projectDir, goFiles) || await hasExtension(projectDir, '.go');
  
  if (hasGo) {
    detectors.push({
      language: 'Go',
      files: goFiles,
      command: 'go',
      setupInstructions: `
# Go support coming soon!
# For now, HTTP requests will be logged with placeholder data
`
    });
  }

  // Java detection
  const javaFiles = ['pom.xml', 'build.gradle', 'build.gradle.kts'];
  const hasJava = await hasAnyFile(projectDir, javaFiles) || await hasExtension(projectDir, '.java');
  
  if (hasJava) {
    detectors.push({
      language: 'Java',
      files: javaFiles,
      command: 'java',
      setupInstructions: `
# Java support coming soon!
# For now, HTTP requests will be logged with placeholder data
`
    });
  }

  return detectors;
}

async function hasAnyFile(dir: string, files: string[]): Promise<boolean> {
  for (const file of files) {
    if (await fs.pathExists(path.join(dir, file))) {
      return true;
    }
  }
  return false;
}

async function hasExtension(dir: string, ...extensions: string[]): Promise<boolean> {
  try {
    const files = await fs.readdir(dir);
    return files.some(file => extensions.some(ext => file.endsWith(ext)));
  } catch {
    return false;
  }
}

export function generateSetupScript(detectors: LanguageDetector[]): string {
  if (detectors.length === 0) {
    return `
# No specific language detected
# HTTP requests will be logged with placeholder data via proxy
`;
  }

  let script = `#!/bin/bash
# EasyAI Multi-Language Setup Script
# Detected languages: ${detectors.map(d => d.language).join(', ')}

echo "🚀 EasyAI Universal Monitoring Setup"
echo ""
`;

  for (const detector of detectors) {
    script += `
echo "📦 ${detector.language} detected!"
${detector.setupInstructions || ''}
echo ""
`;
  }

  script += `
echo "🌐 For all other requests:"
echo "   Proxy will capture with placeholder data (HTTPS encrypted)"
echo ""
echo "💡 Run 'easyai ui' to view all captured requests"
`;

  return script;
}