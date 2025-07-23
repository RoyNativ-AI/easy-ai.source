import fs from 'fs-extra'
import path from 'path'
import { calculateCost, getModelInfo } from './pricing'

// Type extensions for global objects
declare global {
  var _easyaiInterceptionStarted: boolean | undefined
  interface Function {
    _easyaiIntercepted?: boolean
    _easyaiHooked?: boolean
  }
}

// Extend the global fetch type
declare global {
  interface GlobalFetch {
    fetch: typeof fetch & {
      _easyaiIntercepted?: boolean
    }
  }
}

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
  cost?: number
  tokens?: number
  model?: string
  provider?: string
}

class AutoCapture {
  private logPath: string
  private enabled: boolean = true

  constructor() {
    // Look for easyai directory in current working directory
    const projectDir = process.cwd()
    const easyaiDir = path.join(projectDir, 'easyai')
    this.logPath = path.join(easyaiDir, 'logs', 'calls.jsonl')
    
    // Ensure log directory exists
    try {
      fs.ensureDirSync(path.dirname(this.logPath))
    } catch (error) {
      console.warn('⚠️  EasyAI: Could not create auto-capture log directory')
      this.enabled = false
    }
    
    // Load environment variables from easyai.env if available
    this.loadEasyAIEnv(easyaiDir)
    
    // Auto-start interception
    this.startInterception()
  }
  
  private loadEasyAIEnv(easyaiDir: string) {
    try {
      const envPath = path.join(easyaiDir, 'config', 'easyai.env')
      if (fs.pathExistsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8')
        const envLines = envContent.split('\n')
        
        envLines.forEach(line => {
          if (line.includes('HTTP_PROXY=') && !process.env.HTTP_PROXY) {
            const value = line.split('=')[1]
            process.env.HTTP_PROXY = value
          }
          if (line.includes('HTTPS_PROXY=') && !process.env.HTTPS_PROXY) {
            const value = line.split('=')[1] 
            process.env.HTTPS_PROXY = value
          }
        })
        
        if (process.env.HTTP_PROXY) {
          console.log('🌐 EasyAI: Proxy settings loaded from easyai.env')
        }
      }
    } catch (error) {
      // Ignore errors loading proxy settings
    }
  }
  
  private startInterception() {
    try {
      // Only intercept if not already done
      if (global._easyaiInterceptionStarted) {
        return
      }
      global._easyaiInterceptionStarted = true
      
      // Setup unified require hook for all HTTP libraries
      this.setupUnifiedRequireHook()
      
      // Intercept fetch
      this.interceptFetch()
      
      console.log('[EasyAI] Auto-capture initialized - monitoring AI API requests')
    } catch (error) {
      console.warn('[EasyAI] Warning: Could not initialize interceptors:', error)
    }
  }
  
  private setupUnifiedRequireHook() {
    try {
      const Module = require('module');
      const originalRequire = Module.prototype.require;
      const autoCapture = this;
      
      // Only hook once
      if (Module.prototype.require._easyaiHooked) {
        return;
      }
      
      Module.prototype.require = function(id: string) {
        const result = originalRequire.apply(this, arguments);
        
        try {
          // Intercept axios
          if (id === 'axios' && result && result.interceptors && !result._easyaiIntercepted) {
            autoCapture.setupAxiosInterceptors(result);
          }
          
          // Intercept node-fetch and similar libraries
          if ((id === 'node-fetch' || id === 'isomorphic-fetch') && typeof result === 'function' && !result._easyaiIntercepted) {
            return autoCapture.wrapFetchLibrary(result);
          }
        } catch (error) {
          // Ignore individual library setup errors
        }
        
        return result;
      };
      
      Module.prototype.require._easyaiHooked = true;
    } catch (error) {
      // Ignore setup errors
    }
  }

  private isAIProvider(url: string): boolean {
    if (!url) return false
    
    const aiProviders = [
      // OpenAI
      'openai.com',
      'api.openai.com',
      
      // Anthropic
      'anthropic.com',
      'api.anthropic.com',
      
      // Google
      'googleapis.com',
      'generativelanguage.googleapis.com',
      'aiplatform.googleapis.com',
      
      // OpenRouter
      'api.openrouter.ai',
      'openrouter.ai',
      
      // Groq
      'api.groq.com',
      'groq.com',
      
      // Ollama (local)
      'localhost:11434',
      '127.0.0.1:11434',
      
      // Mistral
      'api.mistral.ai',
      'mistral.ai',
      
      // Cohere
      'api.cohere.ai',
      'cohere.ai'
    ]
    
    return aiProviders.some(provider => url.includes(provider))
  }

  private log(entry: LogEntry): void {
    if (!this.enabled) return;
    
    // Only log AI provider requests
    if (entry.url && !this.isAIProvider(entry.url)) return;

    try {
      // Extract model and calculate costs using comprehensive pricing
      const model = this.extractModelName(entry.url || '');
      const provider = this.getProviderName(entry.url || '');
      const tokens = this.extractTokensFromResponse(entry.responseData) || 0;
      const cost = tokens > 0 ? calculateCost(model, tokens) : 0;

      const autoLogEntry = {
        ...entry,
        timestamp: entry.timestamp || new Date().toISOString(),
        id: this.generateId(),
        model,
        provider,
        tokens,
        cost,
        source: 'auto-capture'
      };

      // Write to calls.jsonl (unified logging)
      const logLine = JSON.stringify(autoLogEntry) + '\n'
      fs.appendFileSync(this.logPath, logLine)
      
    } catch (error: any) {
      // Silently fail to avoid breaking user's application
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

  private extractTokensFromResponse(responseData: any): number {
    try {
      const data = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
      
      // OpenAI/OpenRouter format
      if (data?.usage?.total_tokens) {
        return data.usage.total_tokens;
      }
      
      // Anthropic format
      if (data?.usage?.input_tokens && data?.usage?.output_tokens) {
        return data.usage.input_tokens + data.usage.output_tokens;
      }
      
      // Google format
      if (data?.usageMetadata?.totalTokenCount) {
        return data.usageMetadata.totalTokenCount;
      }
      
      return 0;
    } catch {
      return 0;
    }
  }

  private parseBody(body: any): any {
    if (!body) return body
    
    try {
      // Handle different body types
      if (typeof body === 'string') {
        // Try to parse JSON strings
        try {
          return JSON.parse(body)
        } catch {
          return body
        }
      }
      
      if (body instanceof Buffer) {
        try {
          const text = body.toString('utf8')
          return JSON.parse(text)
        } catch {
          return body.toString('utf8')
        }
      }
      
      if (body instanceof FormData || body instanceof URLSearchParams) {
        return '[FormData/URLSearchParams]'
      }
      
      return body
    } catch {
      return body
    }
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

  private wrapFetchLibrary(fetchFn: Function): Function {
    fetchFn._easyaiIntercepted = true;
    
    return (...args: any[]) => {
      const [url, options = {}] = args;
      const startTime = Date.now();
      
      return fetchFn(...args).then((response: any) => {
        const duration = Date.now() - startTime;
        
        if (this.isAIProvider(url)) {
          // Clone response to read body without consuming it
          response.clone().text().then((responseText: string) => {
            let responseData;
            try {
              responseData = responseText ? JSON.parse(responseText) : null;
            } catch {
              responseData = responseText;
            }
            
            this.log({
              timestamp: new Date().toISOString(),
              method: options.method || 'GET',
              url: url,
              status: response.status,
              duration,
              success: response.ok,
              requestBody: this.parseBody(options.body),
              responseData: this.sanitizeData(responseData),
              headers: this.sanitizeData(options.headers)
            });
          }).catch(() => {
            // Ignore response reading errors
          });
        }
        
        return response;
      }).catch((error: any) => {
        const duration = Date.now() - startTime;
        
        if (this.isAIProvider(url)) {
          this.log({
            timestamp: new Date().toISOString(),
            method: options.method || 'GET',
            url: url,
            duration,
            success: false,
            error: error.message,
            requestBody: this.parseBody(options.body),
            headers: this.sanitizeData(options.headers)
          });
        }
        
        throw error;
      });
    };
  }

  private setupAxiosInterceptors(axios: any): void {
    try {
      axios._easyaiIntercepted = true;
      
      // Add request interceptor
      axios.interceptors.request.use((config: any) => {
        config.metadata = { startTime: Date.now() }
        return config
      }, (error: any) => {
        this.log({
          timestamp: new Date().toISOString(),
          success: false,
          error: error.message,
          method: error.config?.method,
          url: error.config?.url
        })
        return Promise.reject(error)
      })

      // Add response interceptor
      axios.interceptors.response.use((response: any) => {
        const duration = Date.now() - (response.config.metadata?.startTime || 0)
        
        this.log({
          timestamp: new Date().toISOString(),
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          status: response.status,
          duration,
          success: true,
          requestBody: this.parseBody(response.config.data),
          responseData: this.sanitizeData(response.data),
          headers: this.sanitizeData(response.config.headers)
        })
        
        return response
      }, (error: any) => {
        const duration = Date.now() - (error.config?.metadata?.startTime || 0)
        
        this.log({
          timestamp: new Date().toISOString(),
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          status: error.response?.status,
          duration,
          success: false,
          error: error.message,
          requestBody: this.parseBody(error.config?.data),
          responseData: error.response?.data ? this.sanitizeData(error.response.data) : undefined,
          headers: this.sanitizeData(error.config?.headers)
        })
        
        return Promise.reject(error)
      })
    } catch (error) {
      // Ignore axios setup errors
    }
  }

  private interceptFetch(): void {
    try {
      if (typeof global !== 'undefined' && global.fetch && !global.fetch._easyaiIntercepted) {
        const originalFetch = global.fetch
        
        global.fetch = async (url: any, options: any = {}) => {
          const startTime = Date.now()
          const urlString = typeof url === 'string' ? url : url.toString()
          
          try {
            const response = await originalFetch(url, options)
            const duration = Date.now() - startTime
            
            // Only log AI provider requests
            if (this.isAIProvider(urlString)) {
              // Clone response to read body without consuming it
              response.clone().text().then((responseText: string) => {
                let responseData = null
                try {
                  responseData = responseText ? JSON.parse(responseText) : null
                } catch {
                  responseData = responseText
                }
                
                this.log({
                  timestamp: new Date().toISOString(),
                  method: (options.method || 'GET').toUpperCase(),
                  url: urlString,
                  status: response.status,
                  duration,
                  success: response.ok,
                  requestBody: this.parseBody(options.body),
                  responseData: this.sanitizeData(responseData),
                  headers: this.sanitizeData(options.headers)
                })
              }).catch(() => {
                // Ignore response reading errors
              })
            }
            
            return response
          } catch (error: any) {
            const duration = Date.now() - startTime
            
            if (this.isAIProvider(urlString)) {
              this.log({
                timestamp: new Date().toISOString(),
                method: (options.method || 'GET').toUpperCase(),
                url: urlString,
                duration,
                success: false,
                error: error.message,
                requestBody: this.parseBody(options.body),
                headers: this.sanitizeData(options.headers)
              })
            }
            
            throw error
          }
        }
        
        global.fetch._easyaiIntercepted = true
      }
    } catch (error) {
      // Fetch interception failed, skip
    }
  }

  public enable(): void {
    // The constructor already sets up interception via startInterception()
    // This method is kept for backwards compatibility
  }
}

// Auto-initialize when required
const autoCapture = new AutoCapture()
autoCapture.enable()

export default autoCapture