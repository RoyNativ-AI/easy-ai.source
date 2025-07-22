import express from 'express'
import path from 'path'
import fs from 'fs-extra'
import axios from 'axios'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'
import cors from 'cors'
import { calculateCost } from './utils/pricing'

// Load environment variables from easyai.env
const envPath = path.join(process.cwd(), 'easyai', 'config', 'easyai.env')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const app = express()
const port = process.env.EASYAI_PORT || 7542

// Middleware
app.use(cors())
app.use(express.json())

// Initialize AI clients
let openai: OpenAI | null = null
let anthropic: Anthropic | null = null

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  if (process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
} catch (error) {
  console.warn('⚠️ AI clients initialization failed:', error)
}

// API Routes
app.get('/api/analytics', async (req, res) => {
  try {
    const logsPath = path.join(process.cwd(), 'easyai', 'easyai.jsonl')
    const autoCaptureLogsPath = path.join(process.cwd(), 'easyai', 'logs', 'auto-capture.jsonl')
    
    let logs: any[] = []

    // Read traditional logs
    if (fs.existsSync(logsPath)) {
      const logsContent = await fs.readFile(logsPath, 'utf8')
      const traditionalLogs = logsContent.trim().split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            const parsed = JSON.parse(line)
            return { ...parsed, source: 'playground' }
          } catch {
            return null
          }
        })
        .filter(Boolean)
      logs = [...logs, ...traditionalLogs]
    }

    // Read auto-capture logs
    if (fs.existsSync(autoCaptureLogsPath)) {
      const autoCaptureContent = await fs.readFile(autoCaptureLogsPath, 'utf8')
      const autoCaptureLogs = await Promise.all(
        autoCaptureContent.trim().split('\n')
          .filter(line => line.trim())
          .map(async line => {
            try {
              const parsed = JSON.parse(line)
              // Extract model from auto-capture logs
              let model = 'unknown'
              if (parsed.url) {
                model = extractModelFromUrl(parsed.url, parsed.requestBody)
              }
              // Extract tokens from response data
              let tokens = 0
              if (parsed.responseData?.usage?.total_tokens) {
                tokens = parsed.responseData.usage.total_tokens
              } else if (typeof parsed.responseData === 'string') {
                try {
                  const responseData = JSON.parse(parsed.responseData)
                  if (responseData.usage?.total_tokens) {
                    tokens = responseData.usage.total_tokens
                  }
                } catch (e) {
                  // Failed to parse, keep tokens as 0
                }
              }
              const cost = calculateCost(model, tokens)
              return { 
                ...parsed, 
                source: 'workspace',
                model,
                tokens,
                cost
              }
            } catch {
              return null
            }
          })
      )
      logs = [...logs, ...autoCaptureLogs.filter(Boolean)]
    }

    if (logs.length === 0) {
      return res.json({
        totalCalls: 0,
        totalTokens: 0,
        totalCosts: 0,
        modelUsage: {},
        lastUpdated: new Date().toISOString()
      })
    }

    const analytics = {
      totalCalls: logs.length,
      totalTokens: logs.reduce((sum, log) => sum + (log.tokens || 0), 0),
      totalCosts: logs.reduce((sum, log) => sum + (log.cost || 0), 0),
      modelUsage: logs.reduce((acc, log) => {
        const model = log.model || 'unknown'
        acc[model] = (acc[model] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      lastUpdated: logs.length > 0 ? logs[logs.length - 1].timestamp : new Date().toISOString()
    }

    res.json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    res.json({
      totalCalls: 0,
      totalTokens: 0,
      totalCosts: 0,
      modelUsage: {},
      lastUpdated: new Date().toISOString()
    })
  }
})

app.get('/api/logs', async (req, res) => {
  try {
    const allLogs: any[] = []
    
    // Load traditional logs from easyai.jsonl
    const traditionalLogsPath = path.join(process.cwd(), 'easyai', 'easyai.jsonl')
    if (fs.existsSync(traditionalLogsPath)) {
      const logsContent = await fs.readFile(traditionalLogsPath, 'utf8')
      const logs = logsContent.trim().split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            const log = JSON.parse(line)
            // Skip old auto-capture entries that were mistakenly written to easyai.jsonl
            if (log.model === 'OpenAI Model' || log.model === 'Anthropic API' || log.model === 'Google API') {
              return null // Filter out generic API entries
            }
            // Only add if it doesn't already have a source (to avoid duplicating auto-capture logs)
            if (log.source) {
              return log // Keep existing source field
            } else {
              // Add original structure for playground logs that don't have it
              const playgroundLog = { ...log, source: 'playground' }
              
              // Add original structure if it doesn't exist (for detailed view compatibility)
              if (!playgroundLog.original && playgroundLog.prompt && playgroundLog.model) {
                // Determine the actual API endpoint that would be called
                let apiUrl = `/api/playground/test`
                let apiHeaders: any = {
                  'Content-Type': 'application/json',
                  'User-Agent': 'EasyAI-Playground/1.0'
                }
                
                if (playgroundLog.model.includes('gpt')) {
                  apiUrl = 'https://api.openai.com/v1/chat/completions'
                  apiHeaders = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ***REDACTED***',
                    'User-Agent': 'EasyAI-Playground/1.0'
                  }
                } else if (playgroundLog.model.includes('claude')) {
                  apiUrl = 'https://api.anthropic.com/v1/messages'
                  apiHeaders = {
                    'Content-Type': 'application/json',
                    'x-api-key': '***REDACTED***',
                    'anthropic-version': '2023-06-01',
                    'User-Agent': 'EasyAI-Playground/1.0'
                  }
                } else if (playgroundLog.model.includes('gemini')) {
                  apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
                  apiHeaders = {
                    'Content-Type': 'application/json',
                    'User-Agent': 'EasyAI-Playground/1.0'
                  }
                }
                
                playgroundLog.original = {
                  method: 'POST',
                  url: apiUrl,
                  status: playgroundLog.success ? 200 : 500,
                  requestBody: JSON.stringify({
                    model: playgroundLog.model,
                    messages: [{ role: 'user', content: playgroundLog.prompt }],
                    max_tokens: 1000
                  }),
                  responseData: playgroundLog.success ? {
                    choices: [{ message: { content: playgroundLog.response || 'No response' } }],
                    usage: { total_tokens: playgroundLog.tokens || 0 },
                    model: playgroundLog.model
                  } : {
                    error: { message: playgroundLog.response || 'Request failed' }
                  },
                  headers: apiHeaders
                }
                
                if (!playgroundLog.success && playgroundLog.response) {
                  playgroundLog.original.error = playgroundLog.response
                }
              }
              
              return playgroundLog
            }
          } catch (error) {
            return null
          }
        })
        .filter(log => log !== null)
      
      allLogs.push(...logs)
    }
    
    // Load auto-capture logs from auto-capture.jsonl
    const autoCaptureLogsPath = path.join(process.cwd(), 'easyai', 'logs', 'auto-capture.jsonl')
    if (fs.existsSync(autoCaptureLogsPath)) {
      const logsContent = await fs.readFile(autoCaptureLogsPath, 'utf8')
      const logs = await Promise.all(
        logsContent.trim().split('\n')
          .filter(line => line.trim())
          .map(async line => {
          try {
            const log = JSON.parse(line)
            // Transform auto-capture format to match expected format
            // Extract tokens from response data
            let tokens = 0
            if (log.responseData?.usage?.total_tokens) {
              tokens = log.responseData.usage.total_tokens
            } else if (typeof log.responseData === 'string') {
              try {
                const responseData = JSON.parse(log.responseData)
                if (responseData.usage?.total_tokens) {
                  tokens = responseData.usage.total_tokens
                }
              } catch (e) {
                // Failed to parse, keep tokens as 0
              }
            }
            
            const model = log.url ? extractModelFromUrl(log.url, log.requestBody) : 'External API'
            const cost = calculateCost(model, tokens)
            
            return {
              id: log.id,
              timestamp: log.timestamp,
              model: model,
              prompt: formatRequestSummary(log),
              tokens: tokens,
              cost: cost,
              duration: log.duration || 0,
              success: log.success,
              response: formatResponseText(log),
              source: 'workspace',
              // Keep original auto-capture data
              original: {
                method: log.method,
                url: log.url,
                status: log.status,
                requestBody: log.requestBody,
                responseData: log.responseData,
                headers: log.headers,
                error: log.error
              }
            }
          } catch (error) {
            return null
          }
        })
      )
      
      allLogs.push(...logs.filter(log => log !== null))
    }
    
    // Sort all logs by timestamp (most recent first)
    allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    res.json(allLogs)
  } catch (error) {
    console.error('Logs error:', error)
    res.json([])
  }
})

// Helper function to extract model name from request body and URL
function extractModelFromUrl(url: string, requestBody?: any): string {
  // Try to extract model from request body first
  if (requestBody) {
    try {
      const body = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody
      if (body.model) {
        return body.model
      }
    } catch (e) {
      // Failed to parse, fall back to URL-based detection
    }
  }
  
  // Fallback to provider-based naming
  if (url.includes('openai.com')) return 'gpt-4'
  if (url.includes('anthropic.com')) return 'claude-3-sonnet'  
  if (url.includes('googleapis.com')) return 'gemini-pro'
  if (url.includes('api.openrouter.ai')) return 'openrouter'
  
  try {
    const domain = new URL(url).hostname
    return domain.replace('api.', '').replace('www.', '')
  } catch {
    return 'External API'
  }
}

// Helper function to create a readable summary of the request
function formatRequestSummary(log: any): string {
  const method = log.method || 'REQUEST'
  const url = log.url || ''
  
  if (log.requestBody) {
    try {
      const body = typeof log.requestBody === 'string' ? JSON.parse(log.requestBody) : log.requestBody
      if (body.prompt) return body.prompt.substring(0, 100) + '...'
      if (body.messages && Array.isArray(body.messages)) {
        const lastMessage = body.messages[body.messages.length - 1]
        if (lastMessage && lastMessage.content) {
          return lastMessage.content.substring(0, 100) + '...'
        }
      }
    } catch (error) {
      // Continue with URL-based summary
    }
  }
  
  return `${method} ${url.split('/').pop() || url}`
}

function formatResponseText(log: any): string {
  if (log.responseData) {
    try {
      const data = typeof log.responseData === 'string' ? JSON.parse(log.responseData) : log.responseData
      // Extract clean response text from OpenAI format
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content
      }
      // Extract from Anthropic format
      if (data.content && data.content[0]?.text) {
        return data.content[0].text
      }
      // Fallback to truncated JSON
      return JSON.stringify(data).substring(0, 200) + '...'
    } catch (e) {
      return log.responseData.substring(0, 200) + '...'
    }
  }
  if (log.error) return `Error: ${log.error}`
  return log.success ? 'Request completed successfully' : 'Request failed'
}

app.get('/api/prompts', async (req, res) => {
  try {
    const prompts: any[] = []
    const promptsBaseDir = path.join(process.cwd(), 'easyai', 'prompts')
    
    if (!fs.existsSync(promptsBaseDir)) {
      return res.json([])
    }

    const categories = await fs.readdir(promptsBaseDir, { withFileTypes: true })
    
    for (const category of categories) {
      if (!category.isDirectory()) continue
      
      const categoryDir = path.join(promptsBaseDir, category.name)
      const files = await fs.readdir(categoryDir)
      
      for (const file of files) {
        if (!file.endsWith('.md')) continue
        
        const name = file.replace('.md', '')
        const filePath = path.join(categoryDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        
        // Parse metadata from content
        const lines = content.split('\n')
        let description = ''
        let model = 'gpt-4'
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('## Description')) {
            description = lines[i + 1]?.trim() || ''
          } else if (line.startsWith('## Model')) {
            model = lines[i + 1]?.trim() || 'gpt-4'
          }
        }
        
        prompts.push({
          name,
          category: category.name,
          content: content.substring(0, 200) + '...',
          fullContent: content,
          description,
          model
        })
      }
    }
    
    res.json(prompts)
  } catch (error) {
    console.error('Prompts error:', error)
    res.json([])
  }
})

app.get('/api/prompts/:category/:name', async (req, res) => {
  try {
    const { category, name } = req.params
    const promptFile = path.join(process.cwd(), 'easyai', 'prompts', category, `${name}.md`)
    
    if (fs.existsSync(promptFile)) {
      const content = await fs.readFile(promptFile, 'utf8')
      res.json({ name, category, content })
    } else {
      res.json({
        name,
        category,
        content: `# ${name}\n\n## Description\nThis is a ${category} prompt.\n\n## Model\ngpt-4\n\n## Content\nAdd your prompt instructions here.\n\n{{input}}`
      })
    }
  } catch (error) {
    console.error('Get prompt error:', error)
    res.status(500).json({ error: 'Failed to read prompt file' })
  }
})

app.post('/api/prompts/:category/:name', async (req, res) => {
  try {
    const { category, name } = req.params
    const { content } = req.body
    
    const promptDir = path.join(process.cwd(), 'easyai', 'prompts', category)
    const promptFile = path.join(promptDir, `${name}.md`)
    
    await fs.ensureDir(promptDir)
    await fs.writeFile(promptFile, content, 'utf8')
    
    console.log(`✅ Prompt saved: ${promptFile}`)
    res.json({ success: true, message: `Prompt ${name} saved successfully` })
  } catch (error) {
    console.error('Save prompt error:', error)
    res.status(500).json({ success: false, error: 'Failed to save prompt file' })
  }
})

app.delete('/api/prompts/:category/:name', async (req, res) => {
  try {
    const { category, name } = req.params
    const promptFile = path.join(process.cwd(), 'easyai', 'prompts', category, `${name}.md`)
    
    if (fs.existsSync(promptFile)) {
      await fs.remove(promptFile)
      console.log(`✅ Prompt deleted: ${promptFile}`)
      res.json({ success: true, message: `Prompt ${name} deleted successfully` })
    } else {
      res.status(404).json({ success: false, error: 'Prompt file not found' })
    }
  } catch (error) {
    console.error('Delete prompt error:', error)
    res.status(500).json({ success: false, error: 'Failed to delete prompt file' })
  }
})

app.post('/api/playground/test', async (req, res) => {
  try {
    const { prompt, model, variables } = req.body
    
    console.log(`🎮 Playground test request: ${model}`)
    console.log(`📝 Prompt: ${prompt?.substring(0, 100)}...`)
    
    // Validate request
    if (!prompt || !model) {
      return res.status(400).json({
        response: 'Error: Missing prompt or model',
        tokens: 0,
        cost: 0,
        duration: 0,
        model: model || 'unknown'
      })
    }
    
    // Log the request
    const logEntry: any = {
      timestamp: new Date().toISOString(),
      prompt: prompt,
      model,
      tokens: 0,
      cost: 0,
      duration: 0,
      success: false,
      response: ''
    }
    
    const startTime = Date.now()
    
    try {
      let response = ''
      let tokens = 0
      let cost = 0
      
      if (model.includes('gpt')) {
        // Read OpenAI key dynamically from file
        const configPath = path.join(process.cwd(), 'easyai', 'config', 'easyai.env')
        let openaiKey = process.env.OPENAI_API_KEY
        
        if (fs.existsSync(configPath)) {
          const envContent = await fs.readFile(configPath, 'utf8')
          const envLines: Record<string, string> = {}
          envContent.split('\n').forEach(line => {
            line = line.trim()
            if (line && !line.startsWith('#')) {
              const [key, ...valueParts] = line.split('=')
              if (key && valueParts.length > 0) {
                envLines[key.trim()] = valueParts.join('=')
              }
            }
          })
          openaiKey = envLines.OPENAI_API_KEY || process.env.OPENAI_API_KEY
        }
        
        if (openaiKey && openaiKey !== '' && openaiKey !== 'your_openai_key_here' && openaiKey !== '***configured***') {
          if (openaiKey === 'demo_openai_key') {
            // Demo mode - provide simulated response
            console.log(`🎯 Using Demo OpenAI for ${model}`)
            response = `Hello! This is a demo response from ${model}.\n\n✨ **You're using EasyAI in trial mode!**\n\nI can help you with:\n- Code review and analysis\n- Writing and debugging\n- Explaining complex concepts\n- Creative writing tasks\n\n🔑 **To unlock real AI responses**, add your OpenAI API key to easyai/config/easyai.env\n\nTry asking me anything - I'm here to help!`
            tokens = Math.floor(Math.random() * 100) + 50
            cost = calculateCost(model, tokens)
          } else {
            console.log(`🤖 Using OpenAI for ${model}`)
            const dynamicOpenai = new OpenAI({ apiKey: openaiKey })
            const completion = await dynamicOpenai.chat.completions.create({
              model,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 1000
            })
            
            response = completion.choices[0]?.message?.content || 'No response'
            tokens = completion.usage?.total_tokens || 0
            cost = calculateCost(model, tokens)
          }
        } else {
          throw new Error('OpenAI API key not configured or invalid')
        }
      } else if (model.includes('claude')) {
        // Read Anthropic key dynamically from file
        const configPath = path.join(process.cwd(), 'easyai', 'config', 'easyai.env')
        let anthropicKey = process.env.ANTHROPIC_API_KEY
        
        if (fs.existsSync(configPath)) {
          const envContent = await fs.readFile(configPath, 'utf8')
          const envLines: Record<string, string> = {}
          envContent.split('\n').forEach(line => {
            line = line.trim()
            if (line && !line.startsWith('#')) {
              const [key, ...valueParts] = line.split('=')
              if (key && valueParts.length > 0) {
                envLines[key.trim()] = valueParts.join('=')
              }
            }
          })
          anthropicKey = envLines.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY
        }
        
        if (anthropicKey && anthropicKey !== '' && anthropicKey !== 'your_anthropic_key_here' && anthropicKey !== '***configured***') {
          if (anthropicKey === 'demo_anthropic_key') {
            // Demo mode - provide simulated response
            console.log(`🎯 Using Demo Anthropic for ${model}`)
            response = `Hi! I'm Claude in demo mode running on ${model}.\n\n🎭 **EasyAI Trial Experience**\n\nI'd be happy to assist you with:\n• Thoughtful analysis and reasoning\n• Creative writing and brainstorming  \n• Code explanation and debugging\n• Research and summarization\n\n🚀 **Ready for the real Claude experience?**\nAdd your Anthropic API key to easyai/config/easyai.env\n\nWhat would you like to explore together?`
            tokens = Math.floor(Math.random() * 120) + 80
            cost = calculateCost(model, tokens)
          } else {
            console.log(`🤖 Using Anthropic for ${model}`)
            const dynamicAnthropic = new Anthropic({ apiKey: anthropicKey })
            const completion = await dynamicAnthropic.messages.create({
              model,
              max_tokens: 1000,
              messages: [{ role: 'user', content: prompt }]
            })
            
            response = completion.content[0]?.type === 'text' ? completion.content[0].text : 'No response'
            tokens = (completion.usage?.input_tokens || 0) + (completion.usage?.output_tokens || 0)
            cost = calculateCost(model, tokens)
          }
        } else {
          throw new Error('Anthropic API key not configured or invalid')
        }
      } else {
        console.log(`🎭 Using simulated response for ${model}`)
        response = `Simulated response from ${model}.\n\nYour prompt was processed successfully. To get real responses, configure your API keys in the Settings page.`
        tokens = Math.floor(Math.random() * 500) + 100
        cost = calculateCost(model, tokens)
      }
      
      const duration = Date.now() - startTime
      
      logEntry.tokens = tokens
      logEntry.cost = cost
      logEntry.duration = duration
      logEntry.success = true
      logEntry.response = response
      
      // Add detailed original data for playground logs (similar to workspace format)
      // Determine the actual API endpoint that would be called
      let apiUrl = `/api/playground/test`
      let apiHeaders: any = {
        'Content-Type': 'application/json',
        'User-Agent': 'EasyAI-Playground/1.0'
      }
      
      if (model.includes('gpt')) {
        apiUrl = 'https://api.openai.com/v1/chat/completions'
        apiHeaders = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ***REDACTED***',
          'User-Agent': 'EasyAI-Playground/1.0'
        }
      } else if (model.includes('claude')) {
        apiUrl = 'https://api.anthropic.com/v1/messages'
        apiHeaders = {
          'Content-Type': 'application/json',
          'x-api-key': '***REDACTED***',
          'anthropic-version': '2023-06-01',
          'User-Agent': 'EasyAI-Playground/1.0'
        }
      } else if (model.includes('gemini')) {
        apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        apiHeaders = {
          'Content-Type': 'application/json',
          'User-Agent': 'EasyAI-Playground/1.0'
        }
      }
      
      logEntry.original = {
        method: 'POST',
        url: apiUrl,
        status: 200,
        requestBody: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000
        }),
        responseData: {
          choices: [{ message: { content: response } }],
          usage: { total_tokens: tokens },
          model: model
        },
        headers: apiHeaders
      }
      
      // Save log
      try {
        const logsPath = path.join(process.cwd(), 'easyai', 'easyai.jsonl')
        await fs.appendFile(logsPath, JSON.stringify(logEntry) + '\n')
      } catch (logError) {
        console.error('⚠️ Failed to save log:', logError)
      }
      
      console.log(`✅ Playground response: ${tokens} tokens, ${duration}ms`)
      
      res.json({
        success: true,
        response,
        tokens,
        cost,
        duration,
        model
      })
    } catch (apiError) {
      console.error('❌ API Error:', apiError)
      const duration = Date.now() - startTime
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error'
      
      logEntry.duration = duration
      logEntry.response = `Error: ${errorMessage}`
      
      // Add detailed original data for playground error logs
      // Determine the actual API endpoint that would be called
      let apiUrl = `/api/playground/test`
      let apiHeaders: any = {
        'Content-Type': 'application/json',
        'User-Agent': 'EasyAI-Playground/1.0'
      }
      
      if (model.includes('gpt')) {
        apiUrl = 'https://api.openai.com/v1/chat/completions'
        apiHeaders = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ***REDACTED***',
          'User-Agent': 'EasyAI-Playground/1.0'
        }
      } else if (model.includes('claude')) {
        apiUrl = 'https://api.anthropic.com/v1/messages'
        apiHeaders = {
          'Content-Type': 'application/json',
          'x-api-key': '***REDACTED***',
          'anthropic-version': '2023-06-01',
          'User-Agent': 'EasyAI-Playground/1.0'
        }
      } else if (model.includes('gemini')) {
        apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        apiHeaders = {
          'Content-Type': 'application/json',
          'User-Agent': 'EasyAI-Playground/1.0'
        }
      }
      
      logEntry.original = {
        method: 'POST',
        url: apiUrl,
        status: 500,
        requestBody: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000
        }),
        responseData: {
          error: { message: errorMessage }
        },
        headers: apiHeaders,
        error: errorMessage
      }
      
      // Save error log
      try {
        const logsPath = path.join(process.cwd(), 'easyai', 'easyai.jsonl')
        await fs.appendFile(logsPath, JSON.stringify(logEntry) + '\n')
      } catch (logError) {
        console.error('⚠️ Failed to save error log:', logError)
      }
      
      res.json({
        success: false,
        error: errorMessage,
        response: `Error: ${errorMessage}`,
        tokens: 0,
        cost: 0,
        duration,
        model
      })
    }
  } catch (error) {
    console.error('❌ Playground error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      response: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      tokens: 0,
      cost: 0,
      duration: 0,
      model: req.body?.model || 'unknown'
    })
  }
})

app.get('/api/config', async (req, res) => {
  try {
    const configPath = path.join(process.cwd(), 'easyai', 'config', 'easyai.env')
    
    let env: Record<string, string> = {}
    if (fs.existsSync(configPath)) {
      const envContent = await fs.readFile(configPath, 'utf8')
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=')
          env[key] = key.includes('KEY') ? (value ? '***configured***' : '') : value
        }
      })
    }
    
    const config = {
      config: {
        ui: { theme: 'light', defaultModel: 'gpt-4', autoSave: true },
        logging: { enabled: true, includeResponses: true, retention: '30d' }
      },
      env
    }
    
    res.json(config)
  } catch (error) {
    console.error('Config error:', error)
    res.status(500).json({ error: 'Failed to load config' })
  }
})

app.post('/api/config', async (req, res) => {
  try {
    const { config, env } = req.body
    
    // Save environment variables
    if (env) {
      const configPath = path.join(process.cwd(), 'easyai', 'config', 'easyai.env')
      
      // Read existing env file to preserve other keys
      let existingEnv: { [key: string]: string } = {}
      try {
        const existingContent = await fs.readFile(configPath, 'utf8')
        existingContent.split('\n').forEach(line => {
          line = line.trim()
          if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=')
            if (key && valueParts.length > 0) {
              existingEnv[key.trim()] = valueParts.join('=')
            }
          }
        })
      } catch (error) {
        // File doesn't exist yet, that's ok
      }
      
      // Merge new env with existing, but don't override with masked values
      const mergedEnv = { ...existingEnv }
      Object.entries(env).forEach(([key, value]) => {
        // Don't save masked values - keep original if value is masked
        if (value !== '***configured***') {
          mergedEnv[key] = String(value)
        }
      })
      const envLines = Object.entries(mergedEnv).map(([key, value]) => `${key}=${value}`)
      await fs.writeFile(configPath, envLines.join('\n') + '\n')
    }
    
    // Save settings.json if config is provided
    if (config) {
      const settingsPath = path.join(process.cwd(), 'easyai', 'config', 'settings.json')
      await fs.writeFile(settingsPath, JSON.stringify({ config }, null, 2))
    }
    
    console.log('✅ Configuration saved')
    res.json({ success: true, message: 'Configuration saved successfully' })
  } catch (error) {
    console.error('Save config error:', error)
    res.status(500).json({ success: false, error: 'Failed to save configuration' })
  }
})

// Models API endpoint
app.get('/api/models', async (req, res) => {
  try {
    const models: any[] = []
    const configPath = path.join(process.cwd(), 'easyai', 'config', 'easyai.env')
    
    if (!fs.existsSync(configPath)) {
      return res.json([])
    }

    // Load environment variables
    const envContent = await fs.readFile(configPath, 'utf8')
    const env: Record<string, string> = {}
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value !== undefined) {
        env[key.trim()] = value.trim()
      }
    })

    // Fetch OpenAI models
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== '' && env.OPENAI_API_KEY !== 'your_openai_key_here') {
      try {
        const response = await axios.get('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })
        
        const openaiModels = response.data.data
          .filter((model: any) => model.id.includes('gpt'))
          .map((model: any) => ({
            id: model.id,
            name: model.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            provider: 'OpenAI',
            description: `OpenAI model - ${model.id}`
          }))
        
        models.push(...openaiModels)
      } catch (error) {
        console.error('Failed to fetch OpenAI models:', error)
      }
    }

    // Fetch Anthropic models
    if (env.ANTHROPIC_API_KEY && env.ANTHROPIC_API_KEY !== '' && env.ANTHROPIC_API_KEY !== 'your_anthropic_key_here' && env.ANTHROPIC_API_KEY !== '***configured***') {
      try {
        const response = await axios.get('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          }
        })
        
        const anthropicModels = response.data.data.map((model: any) => ({
          id: model.id,
          name: model.display_name || model.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          provider: 'Anthropic',
          description: `Claude model - ${model.id}`
        }))
        
        models.push(...anthropicModels)
      } catch (error) {
        console.error('Failed to fetch Anthropic models:', error)
      }
    }

    // Fetch Google Gemini models
    if (env.GOOGLE_API_KEY && env.GOOGLE_API_KEY !== '' && env.GOOGLE_API_KEY !== 'your_google_key_here') {
      try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.GOOGLE_API_KEY}`)
        
        const geminiModels = response.data.models
          .filter((model: any) => model.name.includes('gemini'))
          .map((model: any) => ({
            id: model.name.replace('models/', ''),
            name: model.displayName || model.name.replace('models/', '').replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            provider: 'Google',
            description: `Google Gemini model - ${model.name.replace('models/', '')}`
          }))
        
        models.push(...geminiModels)
      } catch (error) {
        console.error('Failed to fetch Google models:', error)
        // Fallback to static models if API fails
        models.push(
          { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', description: 'Most capable Gemini model' },
          { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', description: 'Fastest Gemini model' }
        )
      }
    }

    // Fetch OpenRouter models
    if (env.OPENROUTER_API_KEY && env.OPENROUTER_API_KEY !== '' && env.OPENROUTER_API_KEY !== 'your_openrouter_key_here') {
      try {
        const response = await axios.get('https://openrouter.ai/api/v1/models', {
          headers: {
            'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })
        
        const openrouterModels = response.data.data
          .map((model: any) => ({
            id: model.id,
            name: model.name || model.id.replace(/\//g, ' - ').replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            provider: 'OpenRouter',
            description: `OpenRouter model - ${model.id}`
          }))
        
        models.push(...openrouterModels)
      } catch (error) {
        console.error('Failed to fetch OpenRouter models:', error)
      }
    }

    // Fetch Ollama models
    if (env.OLLAMA_BASE_URL && env.OLLAMA_BASE_URL !== '') {
      try {
        const response = await axios.get(`${env.OLLAMA_BASE_URL}/api/tags`, { timeout: 3000 })
        
        const ollamaModels = response.data.models.map((model: any) => ({
          id: model.name,
          name: model.name.replace(/:/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          provider: 'Ollama',
          description: `Local Ollama model - ${model.name}`
        }))
        
        models.push(...ollamaModels)
      } catch (error) {
        console.error('Failed to fetch Ollama models:', error)
        // Ollama not running or not accessible
      }
    }

    res.json(models)
  } catch (error) {
    console.error('Models API error:', error)
    res.status(500).json({ error: 'Failed to fetch models' })
  }
})


// Serve React build from web-ui
const buildPath = path.join(__dirname, '../../web-ui/dist')
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath))
  
  // Catch all handler for React Router
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'))
    }
  })
} else {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.send(`
        <html>
          <body>
            <h1>EasyAI Dashboard</h1>
            <p>Frontend build not found. Please run <code>npm run build</code> first.</p>
          </body>
        </html>
      `)
    }
  })
}

export function startServer() {
  const server = app.listen(port, () => {
    console.log(`🎯 EasyAI Dashboard: http://localhost:${port}`)
    console.log('✅ TypeScript + React server ready')
  })
  
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use`)
      console.log('💡 Try using a different port:')
      console.log(`   easyai ui --port ${parseInt(port.toString()) + 1}`)
      process.exit(1)
    } else {
      console.error('❌ Server error:', err)
      process.exit(1)
    }
  })
}

export default app