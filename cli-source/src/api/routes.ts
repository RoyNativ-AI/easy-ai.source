import { Express, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import { loadConfig, saveConfig, loadEnv, logAPICall } from '../utils/helpers';
import { callOpenAI } from '../services/openai';
import { callAnthropic } from '../services/anthropic';

// Transform interceptor log format to UI format
function transformInterceptorLog(rawLog: any): any {
  try {
    // Skip request-only entries - we only want complete request-response pairs
    if (rawLog.type === 'request') {
      return null; // This will be filtered out
    }

    // Extract prompt from request body
    let prompt = '';
    if (rawLog.requestBody) {
      if (rawLog.requestBody.messages && Array.isArray(rawLog.requestBody.messages)) {
        // OpenAI/OpenRouter format
        const lastMessage = rawLog.requestBody.messages[rawLog.requestBody.messages.length - 1];
        prompt = lastMessage?.content || '';
      } else if (rawLog.requestBody.prompt) {
        // Direct prompt field
        prompt = rawLog.requestBody.prompt;
      }
    }

    // Extract response text
    let response = '';
    let success = false;
    
    // Check if we have response data
    if (rawLog.responseData) {
      // Determine success based on status code
      const statusCode = rawLog.status || 0;
      success = statusCode >= 200 && statusCode < 300;
      
      if (rawLog.responseData.choices && Array.isArray(rawLog.responseData.choices) && rawLog.responseData.choices.length > 0) {
        // OpenAI/OpenRouter format
        response = rawLog.responseData.choices[0]?.message?.content || 'No content in response';
      } else if (rawLog.responseData.content && Array.isArray(rawLog.responseData.content) && rawLog.responseData.content.length > 0) {
        // Anthropic format
        response = rawLog.responseData.content[0]?.text || 'No content in response';
      } else if (rawLog.responseData.error) {
        // Error response
        success = false;
        const errorMsg = rawLog.responseData.error.message || rawLog.responseData.error || 'Unknown error';
        response = `Error: ${errorMsg}`;
      } else {
        // Fallback - unknown response format
        response = 'Response received but format not recognized';
      }
    } else {
      response = 'No response data available';
    }

    // Extract model name - clean up the model field
    let model = rawLog.requestBody?.model || rawLog.model || 'Unknown Model';
    
    // Extract tokens
    let tokens = 0;
    if (rawLog.responseData?.usage) {
      const usage = rawLog.responseData.usage;
      tokens = usage.total_tokens || 
               (usage.input_tokens + usage.output_tokens) || 
               (usage.prompt_tokens + usage.completion_tokens) || 0;
    }

    // Calculate timestamp
    let timestamp = rawLog.timestamp;
    if (typeof timestamp === 'number') {
      timestamp = new Date(timestamp).toISOString();
    }

    // Generate a stable ID
    const provider = rawLog.provider || 'unknown';
    const id = rawLog.id || `${provider}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const transformedLog = {
      id,
      timestamp: timestamp || new Date().toISOString(),
      prompt: prompt || 'No prompt available',
      model: model || 'Unknown Model',
      tokens: tokens || 0,
      cost: rawLog.cost || 0,
      duration: rawLog.duration || 0,
      success: success,
      response: response || 'No response available',
      source: rawLog.source || 'python-interceptor',
      provider: provider,
      method: rawLog.method || 'POST',
      endpoint: rawLog.url || '',
      request: rawLog.requestBody || {},
      request_flow: {
        method: rawLog.method || 'POST',
        url: rawLog.url || '',
        headers: rawLog.headers || {}
      },
      response_full: rawLog.responseData || {},
      performance: {
        duration: rawLog.duration || 0,
        status: rawLog.status || 0
      }
    };
    
    return transformedLog;
  } catch (error) {
    console.error('Error transforming interceptor log:', error, rawLog);
    return null; // Return null to filter out problematic entries
  }
}

export function setupAPIRoutes(app: Express, projectDir: string): void {
  const easyaiDir = path.join(projectDir, 'easyai');

  // Get analytics data - calculated directly from log files
  app.get('/api/analytics', async (req: Request, res: Response) => {
    try {
      const logsPath = path.join(easyaiDir, 'logs', 'calls.jsonl');
      
      if (!await fs.pathExists(logsPath)) {
        // Return default analytics if no logs exist
        return res.json({
          totalCalls: 0,
          totalTokens: 0,
          modelUsage: {},
          lastUpdated: new Date().toISOString()
        });
      }

      const logsContent = await fs.readFile(logsPath, 'utf-8');
      const lines = logsContent.trim().split('\n').filter(line => line.trim());
      
      let totalCalls = 0;
      let totalTokens = 0;
      const modelUsage: Record<string, number> = {};
      let lastUpdated = new Date('1970-01-01').toISOString();

      // Calculate analytics from actual log entries
      for (const line of lines) {
        try {
          const rawEntry = JSON.parse(line);
          
          // Only count response entries to avoid double counting
          if (rawEntry.type === 'request') continue;
          
          totalCalls++;
          
          // Handle interceptor format - check multiple ways to identify interceptor format
          if (rawEntry.source === 'python-interceptor' || rawEntry.source === 'auto-capture' || 
              (rawEntry.provider && rawEntry.type && rawEntry.requestBody)) {
            // Count tokens from interceptor format
            if (rawEntry.responseData?.usage) {
              const usage = rawEntry.responseData.usage;
              totalTokens += usage.total_tokens || 
                            (usage.input_tokens + usage.output_tokens) || 0;
            }
            
            // Count model usage from interceptor format
            const model = rawEntry.model || rawEntry.requestBody?.model || 'Unknown Model';
            modelUsage[model] = (modelUsage[model] || 0) + 1;
            
            // Track latest timestamp from interceptor format
            let timestamp = rawEntry.timestamp;
            if (typeof timestamp === 'number') {
              timestamp = new Date(timestamp).toISOString();
            }
            if (timestamp && timestamp > lastUpdated) {
              lastUpdated = timestamp;
            }
          } else {
            // Handle legacy format
            if (rawEntry.usage && rawEntry.usage.total_tokens) {
              totalTokens += rawEntry.usage.total_tokens;
            }
            
            if (rawEntry.model) {
              modelUsage[rawEntry.model] = (modelUsage[rawEntry.model] || 0) + 1;
            }
            
            if (rawEntry.timestamp && rawEntry.timestamp > lastUpdated) {
              lastUpdated = rawEntry.timestamp;
            }
          }
        } catch (parseError) {
          // Skip malformed log entries
          continue;
        }
      }

      res.json({
        totalCalls,
        totalTokens,
        modelUsage,
        lastUpdated: lastUpdated || new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate analytics from logs' });
    }
  });

  // Debug endpoint to check log transformation
  app.get('/api/logs/debug', async (req: Request, res: Response) => {
    try {
      const logsPath = path.join(easyaiDir, 'logs', 'calls.jsonl');
      
      if (!await fs.pathExists(logsPath)) {
        return res.json({ error: 'No logs file found', path: logsPath });
      }

      const content = await fs.readFile(logsPath, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line.trim());
      
      const debugInfo: any = {
        file_path: logsPath,
        total_lines: lines.length,
        raw_lines: lines.slice(0, 2), // Show first 2 raw lines
        transformed_lines: []
      };

      // Try to transform first few lines
      for (let i = 0; i < Math.min(2, lines.length); i++) {
        try {
          const rawLog = JSON.parse(lines[i]);
          const transformed = transformInterceptorLog(rawLog);
          debugInfo.transformed_lines.push({
            original: rawLog,
            transformed: transformed,
            should_transform: rawLog.source === 'python-interceptor' || rawLog.source === 'auto-capture' || 
                             (rawLog.provider && rawLog.type && rawLog.requestBody)
          });
        } catch (error: any) {
          debugInfo.transformed_lines.push({
            error: error.message,
            line: lines[i]
          });
        }
      }

      res.json(debugInfo);
    } catch (error: any) {
      res.status(500).json({ error: 'Debug failed', message: error.message });
    }
  });

  // Get recent logs
  app.get('/api/logs', async (req: Request, res: Response) => {
    try {
      const { limit = 50, filter } = req.query;
      const logsPath = path.join(easyaiDir, 'logs', 'calls.jsonl');
      
      if (!await fs.pathExists(logsPath)) {
        return res.json([]);
      }

      const content = await fs.readFile(logsPath, 'utf-8');
      let logs = content.trim().split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            const rawLog = JSON.parse(line);
            
            // Transform interceptor format to UI format
            // Check if this is from Python interceptor
            if (rawLog.source === 'python-interceptor' || rawLog.source === 'auto-capture' || 
                (rawLog.provider && rawLog.type && rawLog.requestBody)) {
              const transformed = transformInterceptorLog(rawLog);
              if (transformed === null) {
                return null; // Will be filtered out
              }
              return transformed;
            }
            
            // Return legacy format as-is
            return rawLog;
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      if (filter) {
        logs = logs.filter(log => 
          log.model?.includes(filter) || 
          log.prompt?.includes(filter) ||
          (log.success === false && filter === 'error')
        );
      }

      logs = logs.slice(-Number(limit)).reverse();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load logs' });
    }
  });

  // Get all prompts
  app.get('/api/prompts', async (req: Request, res: Response) => {
    try {
      const promptsDir = path.join(easyaiDir, 'prompts');
      const prompts = await getAllPrompts(promptsDir);
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load prompts' });
    }
  });

  // Get specific prompt
  app.get('/api/prompts/:category/:name', async (req: Request, res: Response) => {
    try {
      const { category, name } = req.params;
      const promptPath = path.join(easyaiDir, 'prompts', category, `${name}.md`);
      
      if (!await fs.pathExists(promptPath)) {
        return res.status(404).json({ error: 'Prompt not found' });
      }

      const content = await fs.readFile(promptPath, 'utf-8');
      res.json({ name, category, content });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load prompt' });
    }
  });

  // Save prompt
  app.post('/api/prompts/:category/:name', async (req: Request, res: Response) => {
    try {
      const { category, name } = req.params;
      const { content } = req.body;
      
      const promptPath = path.join(easyaiDir, 'prompts', category, `${name}.md`);
      await fs.ensureDir(path.dirname(promptPath));
      await fs.writeFile(promptPath, content);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save prompt' });
    }
  });

  // Delete prompt
  app.delete('/api/prompts/:category/:name', async (req: Request, res: Response) => {
    try {
      const { category, name } = req.params;
      const promptPath = path.join(easyaiDir, 'prompts', category, `${name}.md`);
      
      if (await fs.pathExists(promptPath)) {
        await fs.unlink(promptPath);
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete prompt' });
    }
  });

  // Get configuration
  app.get('/api/config', async (req: Request, res: Response) => {
    try {
      const config = await loadConfig(projectDir);
      const env = await loadEnv(projectDir);
      
      // Don't send actual API keys
      const safeEnv = { ...env };
      Object.keys(safeEnv).forEach(key => {
        if (key.includes('KEY')) {
          safeEnv[key] = safeEnv[key] ? '***configured***' : '';
        }
      });
      
      res.json({ config, env: safeEnv });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load configuration' });
    }
  });

  // Update configuration
  app.post('/api/config', async (req: Request, res: Response) => {
    try {
      const { config, env } = req.body;
      
      if (config) {
        await saveConfig(projectDir, config);
      }
      
      if (env) {
        await updateEnvFile(projectDir, env);
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save configuration' });
    }
  });

  // Test prompt in playground
  app.post('/api/playground/test', async (req: Request, res: Response) => {
    try {
      const { prompt, model, variables } = req.body;
      
      const env = await loadEnv(projectDir);
      let processedPrompt = prompt;
      
      // Process variables
      if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
          processedPrompt = processedPrompt.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, 'g'), 
            String(value)
          );
        });
      }

      const startTime = Date.now();
      let response;

      if (model.startsWith('gpt') || model.startsWith('o1')) {
        response = await callOpenAI(env.OPENAI_API_KEY, model, processedPrompt);
      } else if (model.startsWith('claude')) {
        response = await callAnthropic(env.ANTHROPIC_API_KEY, model, processedPrompt);
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }

      const duration = Date.now() - startTime;

      // Log the playground test
      await logAPICall(projectDir, {
        prompt: 'playground-test',
        model,
        input: processedPrompt.substring(0, 200) + '...',
        response: response.content.substring(0, 200) + '...',
        tokens: response.tokens,
        duration,
        cost: response.cost,
        success: true
      });

      res.json({
        response: response.content,
        tokens: response.tokens,
        cost: response.cost,
        duration
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

async function getAllPrompts(promptsDir: string): Promise<any[]> {
  const prompts: any[] = [];
  
  try {
    const categories = await fs.readdir(promptsDir);
    
    for (const category of categories) {
      const categoryPath = path.join(promptsDir, category);
      if ((await fs.stat(categoryPath)).isDirectory()) {
        const files = await fs.readdir(categoryPath);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const name = file.replace('.md', '');
            const filePath = path.join(categoryPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            
            prompts.push({
              name,
              category,
              content: content.substring(0, 200) + '...',
              fullContent: content
            });
          }
        }
      }
    }
  } catch (error) {
    // Directory might not exist yet
  }
  
  return prompts;
}

async function updateEnvFile(projectDir: string, envUpdates: Record<string, string>): Promise<void> {
  const envPath = path.join(projectDir, 'easyai', 'config', 'easyai.env');
  let envContent = await fs.readFile(envPath, 'utf-8');
  
  Object.entries(envUpdates).forEach(([key, value]) => {
    if (value && value !== '***configured***') {
      const regex = new RegExp(`${key}=.*`);
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    }
  });
  
  await fs.writeFile(envPath, envContent);
}