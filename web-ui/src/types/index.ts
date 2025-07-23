export interface AnalyticsData {
  totalCalls: number;
  totalTokens: number;
  modelUsage: Record<string, number>;
  lastUpdated: string;
}

export interface PromptAnalysis {
  source: 'hardcoded' | 'library' | 'mixed' | 'unknown';
  prompt_preview?: string;
  library_match?: {
    name: string;
    category: string;
    file: string;
    confidence: number;
  };
  code_location?: {
    file: string;
    function: string;
    line: number;
  };
}

export interface LogEntry {
  timestamp: string;
  prompt: string;
  model: string;
  tokens: number;
  cost: number;
  duration: number;
  success: boolean;
  response?: string;
  // New fields for auto-capture integration
  source?: string; // 'playground' | 'auto-capture' | undefined for legacy logs
  category?: string; // 'workspace' | 'playground'  
  // Prompt analysis data
  prompt_analysis?: PromptAnalysis;
  // Enhanced properties for Full Details view
  id?: string;
  endpoint?: string;
  method?: string;
  request?: any;
  request_flow?: any;
  response_full?: any;
  performance?: any;
  provider?: string;
  api_endpoint?: string;
  api_call?: any;
  user_agent?: string;
  ip_address?: string;
  session_id?: string;
}

export interface Prompt {
  name: string;
  category: string;
  content: string;
  fullContent?: string;
  description?: string;
  variables?: string[];
  model?: string;
}

export interface Config {
  config: {
    ui: {
      theme: string;
      defaultModel: string;
      autoSave: boolean;
    };
    logging: {
      enabled: boolean;
      includeResponses: boolean;
      retention: string;
    };
  };
  env: Record<string, string>;
}

export interface PlaygroundRequest {
  prompt: string;
  model: string | string[];
  variables?: Record<string, string>;
}

export interface PlaygroundResponse {
  response: string;
  tokens: number;
  cost: number;
  duration: number;
  model?: string;
}