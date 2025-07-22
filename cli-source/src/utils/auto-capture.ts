import fs from 'fs-extra'
import path from 'path'

interface LogEntry {
  timestamp: string
  method?: string
  url?: string
  status?: number
  duration?: number
  success: boolean
  error?: string
  requestBody?: any
  responseData?: any
  userAgent?: string
  headers?: Record<string, string>
}

class AutoCapture {
  private logPath: string
  private enabled: boolean = true

  constructor() {
    // Look for easyai directory in current working directory
    const projectDir = process.cwd()
    const easyaiDir = path.join(projectDir, 'easyai')
    this.logPath = path.join(easyaiDir, 'logs', 'auto-capture.jsonl')
    
    // Ensure log directory exists
    try {
      fs.ensureDirSync(path.dirname(this.logPath))
    } catch (error) {
      console.warn('⚠️  EasyAI: Could not create auto-capture log directory')
      this.enabled = false
    }
  }

  private isAIProvider(url: string): boolean {
    if (!url) return false
    
    const aiProviders = [
      'openai.com',
      'api.openai.com',
      'anthropic.com',
      'api.anthropic.com',
      'googleapis.com',
      'generativelanguage.googleapis.com',
      'api.openrouter.ai',
      'openrouter.ai',
      'localhost:11434', // Ollama
      '127.0.0.1:11434'  // Ollama
    ]
    
    return aiProviders.some(provider => url.includes(provider))
  }

  private log(entry: LogEntry): void {
    if (!this.enabled) {
      console.log('🚫 Auto-capture disabled, skipping log');
      return;
    }
    
    // Only log AI provider requests
    if (entry.url && !this.isAIProvider(entry.url)) {
      console.log(`🚫 Skipping non-AI provider: ${entry.url}`);
      return
    }

    console.log(`📝 Logging AI provider request: ${entry.method} ${entry.url}`);

    try {
      const autoLogEntry = {
        ...entry,
        timestamp: entry.timestamp || new Date().toISOString(),
        id: this.generateId()
      };

      // Write to auto-capture.jsonl only (server will read and merge both files)
      const logLine = JSON.stringify(autoLogEntry) + '\n'
      fs.appendFileSync(this.logPath, logLine)
      console.log(`✅ Logged to auto-capture: ${this.logPath}`);
      
    } catch (error: any) {
      console.error('❌ Failed to write log:', error.message);
    }
  }

  private extractModelName(url: string): string {
    if (url.includes('openai.com')) {
      if (url.includes('gpt-4')) return 'gpt-4';
      if (url.includes('gpt-3.5')) return 'gpt-3.5-turbo';
      return 'OpenAI Model';
    }
    if (url.includes('anthropic.com')) return 'claude-3-sonnet';
    if (url.includes('googleapis.com')) return 'gemini-pro';
    return 'Unknown Model';
  }

  private getProviderName(url: string): string {
    if (url.includes('openai.com')) return 'openai';
    if (url.includes('anthropic.com')) return 'anthropic';
    if (url.includes('googleapis.com')) return 'google';
    if (url.includes('openrouter.ai')) return 'openrouter';
    return 'unknown';
  }

  private formatPrompt(entry: LogEntry): string {
    if (entry.requestBody) {
      try {
        const body = typeof entry.requestBody === 'string' ? JSON.parse(entry.requestBody) : entry.requestBody;
        if (body.prompt) return body.prompt;
        if (body.messages && Array.isArray(body.messages)) {
          const lastMessage = body.messages[body.messages.length - 1];
          if (lastMessage && lastMessage.content) return lastMessage.content;
        }
      } catch (e) {}
    }
    return `${entry.method} ${entry.url}`;
  }

  private formatResponse(entry: LogEntry): string {
    if (entry.responseData) {
      try {
        const data = typeof entry.responseData === 'string' ? JSON.parse(entry.responseData) : entry.responseData;
        if (data.choices && data.choices[0]?.message?.content) {
          return data.choices[0].message.content;
        }
        if (data.content && data.content[0]?.text) {
          return data.content[0].text;
        }
      } catch (e) {}
    }
    if (entry.error) return `Error: ${entry.error}`;
    return entry.success ? 'Request completed successfully' : 'Request failed';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private sanitizeData(data: any): any {
    if (!data) return data
    
    // Remove sensitive data
    const sensitive = ['password', 'token', 'key', 'secret', 'authorization', 'auth']
    if (typeof data === 'object') {
      const cleaned = { ...data }
      Object.keys(cleaned).forEach(key => {
        if (sensitive.some(s => key.toLowerCase().includes(s))) {
          cleaned[key] = '***REDACTED***'
        }
      })
      return cleaned
    }
    return data
  }

  public interceptAxios(): void {
    try {
      console.log('🔧 Setting up axios interception...');
      
      // Patch require to intercept axios loading
      const Module = require('module');
      const originalRequire = Module.prototype.require;
      const autoCapture = this;
      
      Module.prototype.require = function(id: string) {
        const result = originalRequire.apply(this, arguments);
        
        // If axios is being required, add our interceptors
        if (id === 'axios' && result && result.interceptors) {
          console.log('🎯 Axios detected! Adding interceptors...');
          
          // Only add if not already added (check by looking for our marker)
          if (!result._easyaiIntercepted) {
            result._easyaiIntercepted = true;
            
            // Add request interceptor
            result.interceptors.request.use((config: any) => {
              config.metadata = { startTime: Date.now() }
              console.log(`🚀 Intercepted request: ${config.method?.toUpperCase()} ${config.url}`);
              return config
            }, (error: any) => {
              console.log(`❌ Request error intercepted: ${error.message}`);
              autoCapture.log({
                timestamp: new Date().toISOString(),
                success: false,
                error: error.message,
                method: error.config?.method,
                url: error.config?.url
              })
              return Promise.reject(error)
            })

            // Add response interceptor
            result.interceptors.response.use((response: any) => {
              const duration = Date.now() - (response.config.metadata?.startTime || 0)
              
              autoCapture.log({
                timestamp: new Date().toISOString(),
                method: response.config.method?.toUpperCase(),
                url: response.config.url,
                status: response.status,
                duration,
                success: true,
                requestBody: autoCapture.sanitizeData(response.config.data),
                responseData: autoCapture.sanitizeData(response.data),
                headers: autoCapture.sanitizeData(response.config.headers)
              })
              
              return response
            }, (error: any) => {
              const duration = Date.now() - (error.config?.metadata?.startTime || 0)
              
              autoCapture.log({
                timestamp: new Date().toISOString(),
                method: error.config?.method?.toUpperCase(),
                url: error.config?.url,
                status: error.response?.status,
                duration,
                success: false,
                error: error.message,
                requestBody: autoCapture.sanitizeData(error.config?.data),
                headers: autoCapture.sanitizeData(error.config?.headers)
              })
              
              return Promise.reject(error)
            })
            
            console.log('✅ Interceptors added to axios instance');
          }
        }
        
        return result;
      };
      
      console.log('🔍 EasyAI: Axios require hook enabled');
    } catch (error) {
      // Axios not available, skip
    }
  }

  public interceptFetch(): void {
    try {
      if (typeof global !== 'undefined' && global.fetch) {
        const originalFetch = global.fetch
        
        global.fetch = async (url: any, options: any = {}) => {
          const startTime = Date.now()
          
          try {
            const response = await originalFetch(url, options)
            const duration = Date.now() - startTime
            
            this.log({
              timestamp: new Date().toISOString(),
              method: (options.method || 'GET').toUpperCase(),
              url: typeof url === 'string' ? url : url.toString(),
              status: response.status,
              duration,
              success: response.ok,
              requestBody: this.sanitizeData(options.body),
              headers: this.sanitizeData(options.headers)
            })
            
            return response
          } catch (error: any) {
            const duration = Date.now() - startTime
            
            this.log({
              timestamp: new Date().toISOString(),
              method: (options.method || 'GET').toUpperCase(),
              url: typeof url === 'string' ? url : url.toString(),
              duration,
              success: false,
              error: error.message,
              requestBody: this.sanitizeData(options.body),
              headers: this.sanitizeData(options.headers)
            })
            
            throw error
          }
        }

        console.log('🔍 EasyAI: Fetch interceptor enabled (AI providers only)')
      }
    } catch (error) {
      // Fetch interception failed, skip
    }
  }

  public enable(): void {
    this.interceptAxios()
    this.interceptFetch()
    console.log('📊 EasyAI: Auto-capture logging enabled')
    console.log('🎯 Only capturing AI provider requests (OpenAI, Anthropic, Google, OpenRouter, Ollama)')
    console.log(`📁 Logs will be saved to: ${this.logPath}`)
  }
}

// Auto-initialize when required
const autoCapture = new AutoCapture()
autoCapture.enable()

export default autoCapture