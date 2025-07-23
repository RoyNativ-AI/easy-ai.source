/**
 * Model Pricing Data
 * 
 * Generated from OpenRouter CSV on 2025-07-23T02:34:52.375Z
 * Total models: 321
 * Total mappings: 644
 * 
 * Pricing is per token (direct from OpenRouter API)
 */

export interface ModelPricing {
  prompt: number
  completion: number
  name?: string
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  "qwen/qwen3-coder": {
    "prompt": 0.000001,
    "completion": 0.000005,
    "name": "Qwen: Qwen3 Coder"
  },
  "qwen3-coder": {
    "prompt": 0.000001,
    "completion": 0.000005
  },
  "bytedance/ui-tars-1.5-7b": {
    "prompt": 1e-7,
    "completion": 2e-7,
    "name": "Bytedance: UI-TARS 7B"
  },
  "ui-tars-1.5-7b": {
    "prompt": 1e-7,
    "completion": 2e-7
  },
  "google/gemini-2.5-flash-lite": {
    "prompt": 1e-7,
    "completion": 4e-7,
    "name": "Google: Gemini 2.5 Flash Lite"
  },
  "gemini-2.5-flash-lite": {
    "prompt": 1e-7,
    "completion": 4e-7
  },
  "qwen/qwen3-235b-a22b-07-25:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: Qwen3 235B A22B 2507 (free)"
  },
  "qwen3-235b-a22b-07-25:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen3-235b-a22b-07-25": {
    "prompt": 1.2e-7,
    "completion": 5.9e-7,
    "name": "Qwen: Qwen3 235B A22B 2507"
  },
  "qwen3-235b-a22b-07-25": {
    "prompt": 1.2e-7,
    "completion": 5.9e-7
  },
  "switchpoint/router": {
    "prompt": 8.5e-7,
    "completion": 0.0000034,
    "name": "Switchpoint Router"
  },
  "router": {
    "prompt": 8.5e-7,
    "completion": 0.0000034
  },
  "moonshotai/kimi-k2:free": {
    "prompt": 0,
    "completion": 0,
    "name": "MoonshotAI: Kimi K2 (free)"
  },
  "kimi-k2:free": {
    "prompt": 0,
    "completion": 0
  },
  "moonshotai/kimi-k2": {
    "prompt": 1.4e-7,
    "completion": 0.00000249,
    "name": "MoonshotAI: Kimi K2"
  },
  "kimi-k2": {
    "prompt": 1.4e-7,
    "completion": 0.00000249
  },
  "thudm/glm-4.1v-9b-thinking": {
    "prompt": 3.5e-8,
    "completion": 1.38e-7,
    "name": "THUDM: GLM 4.1V 9B Thinking"
  },
  "glm-4.1v-9b-thinking": {
    "prompt": 3.5e-8,
    "completion": 1.38e-7
  },
  "mistralai/devstral-medium": {
    "prompt": 4e-7,
    "completion": 0.000002,
    "name": "Mistral: Devstral Medium"
  },
  "devstral-medium": {
    "prompt": 4e-7,
    "completion": 0.000002
  },
  "mistralai/devstral-small": {
    "prompt": 7e-8,
    "completion": 2.8e-7,
    "name": "Mistral: Devstral Small 1.1"
  },
  "devstral-small": {
    "prompt": 7e-8,
    "completion": 2.8e-7
  },
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Venice: Uncensored (free)"
  },
  "dolphin-mistral-24b-venice-edition:free": {
    "prompt": 0,
    "completion": 0
  },
  "x-ai/grok-4": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "xAI: Grok 4"
  },
  "grok-4": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "google/gemma-3n-e2b-it:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Google: Gemma 3n 2B (free)"
  },
  "gemma-3n-e2b-it:free": {
    "prompt": 0,
    "completion": 0
  },
  "tencent/hunyuan-a13b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Tencent: Hunyuan A13B Instruct (free)"
  },
  "hunyuan-a13b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "tencent/hunyuan-a13b-instruct": {
    "prompt": 3e-8,
    "completion": 3e-8,
    "name": "Tencent: Hunyuan A13B Instruct"
  },
  "hunyuan-a13b-instruct": {
    "prompt": 3e-8,
    "completion": 3e-8
  },
  "tngtech/deepseek-r1t2-chimera:free": {
    "prompt": 0,
    "completion": 0,
    "name": "TNG: DeepSeek R1T2 Chimera (free)"
  },
  "deepseek-r1t2-chimera:free": {
    "prompt": 0,
    "completion": 0
  },
  "tngtech/deepseek-r1t2-chimera": {
    "prompt": 3.02e-7,
    "completion": 3.02e-7,
    "name": "TNG: DeepSeek R1T2 Chimera"
  },
  "deepseek-r1t2-chimera": {
    "prompt": 3.02e-7,
    "completion": 3.02e-7
  },
  "morph/morph-v3-large": {
    "prompt": 0.0000012,
    "completion": 0.0000027,
    "name": "Morph: Morph V3 Large"
  },
  "morph-v3-large": {
    "prompt": 0.0000012,
    "completion": 0.0000027
  },
  "morph/morph-v3-fast": {
    "prompt": 0.0000012,
    "completion": 0.0000027,
    "name": "Morph: Morph V3 Fast"
  },
  "morph-v3-fast": {
    "prompt": 0.0000012,
    "completion": 0.0000027
  },
  "baidu/ernie-4.5-300b-a47b": {
    "prompt": 2.8e-7,
    "completion": 0.0000011,
    "name": "Baidu: ERNIE 4.5 300B A47B"
  },
  "ernie-4.5-300b-a47b": {
    "prompt": 2.8e-7,
    "completion": 0.0000011
  },
  "thedrummer/anubis-70b-v1.1": {
    "prompt": 5e-7,
    "completion": 8e-7,
    "name": "TheDrummer: Anubis 70B V1.1"
  },
  "anubis-70b-v1.1": {
    "prompt": 5e-7,
    "completion": 8e-7
  },
  "inception/mercury": {
    "prompt": 2.5e-7,
    "completion": 0.000001,
    "name": "Inception: Mercury"
  },
  "mercury": {
    "prompt": 2.5e-7,
    "completion": 0.000001
  },
  "morph/morph-v2": {
    "prompt": 0.0000012,
    "completion": 0.0000027,
    "name": "Morph: Fast Apply"
  },
  "morph-v2": {
    "prompt": 0.0000012,
    "completion": 0.0000027
  },
  "mistralai/mistral-small-3.2-24b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Mistral: Mistral Small 3.2 24B (free)"
  },
  "mistral-small-3.2-24b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "mistralai/mistral-small-3.2-24b-instruct": {
    "prompt": 5e-8,
    "completion": 1e-7,
    "name": "Mistral: Mistral Small 3.2 24B"
  },
  "mistral-small-3.2-24b-instruct": {
    "prompt": 5e-8,
    "completion": 1e-7
  },
  "minimax/minimax-m1": {
    "prompt": 3e-7,
    "completion": 0.00000165,
    "name": "MiniMax: MiniMax M1"
  },
  "minimax-m1": {
    "prompt": 3e-7,
    "completion": 0.00000165
  },
  "google/gemini-2.5-flash-lite-preview-06-17": {
    "prompt": 1e-7,
    "completion": 4e-7,
    "name": "Google: Gemini 2.5 Flash Lite Preview 06-17"
  },
  "gemini-2.5-flash-lite-preview-06-17": {
    "prompt": 1e-7,
    "completion": 4e-7
  },
  "google/gemini-2.5-flash": {
    "prompt": 3e-7,
    "completion": 0.0000025,
    "name": "Google: Gemini 2.5 Flash"
  },
  "gemini-2.5-flash": {
    "prompt": 3e-7,
    "completion": 0.0000025
  },
  "google/gemini-2.5-pro": {
    "prompt": 0.00000125,
    "completion": 0.00001,
    "name": "Google: Gemini 2.5 Pro"
  },
  "gemini-2.5-pro": {
    "prompt": 0.00000125,
    "completion": 0.00001
  },
  "moonshotai/kimi-dev-72b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Kimi Dev 72b (free)"
  },
  "kimi-dev-72b:free": {
    "prompt": 0,
    "completion": 0
  },
  "openai/o3-pro": {
    "prompt": 0.00002,
    "completion": 0.00008,
    "name": "OpenAI: o3 Pro"
  },
  "o3-pro": {
    "prompt": 0.00002,
    "completion": 0.00008
  },
  "x-ai/grok-3-mini": {
    "prompt": 3e-7,
    "completion": 5e-7,
    "name": "xAI: Grok 3 Mini"
  },
  "grok-3-mini": {
    "prompt": 3e-7,
    "completion": 5e-7
  },
  "x-ai/grok-3": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "xAI: Grok 3"
  },
  "grok-3": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "mistralai/magistral-small-2506": {
    "prompt": 5e-7,
    "completion": 0.0000015,
    "name": "Mistral: Magistral Small 2506"
  },
  "magistral-small-2506": {
    "prompt": 5e-7,
    "completion": 0.0000015
  },
  "mistralai/magistral-medium-2506": {
    "prompt": 0.000002,
    "completion": 0.000005,
    "name": "Mistral: Magistral Medium 2506"
  },
  "magistral-medium-2506": {
    "prompt": 0.000002,
    "completion": 0.000005
  },
  "mistralai/magistral-medium-2506:thinking": {
    "prompt": 0.000002,
    "completion": 0.000005,
    "name": "Mistral: Magistral Medium 2506 (thinking)"
  },
  "magistral-medium-2506:thinking": {
    "prompt": 0.000002,
    "completion": 0.000005
  },
  "google/gemini-2.5-pro-preview": {
    "prompt": 0.00000125,
    "completion": 0.00001,
    "name": "Google: Gemini 2.5 Pro Preview 06-05"
  },
  "gemini-2.5-pro-preview": {
    "prompt": 0.00000125,
    "completion": 0.00001
  },
  "deepseek/deepseek-r1-distill-qwen-7b": {
    "prompt": 1e-7,
    "completion": 2e-7,
    "name": "DeepSeek: R1 Distill Qwen 7B"
  },
  "deepseek-r1-distill-qwen-7b": {
    "prompt": 1e-7,
    "completion": 2e-7
  },
  "deepseek/deepseek-r1-0528-qwen3-8b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "DeepSeek: Deepseek R1 0528 Qwen3 8B (free)"
  },
  "deepseek-r1-0528-qwen3-8b:free": {
    "prompt": 0,
    "completion": 0
  },
  "deepseek/deepseek-r1-0528-qwen3-8b": {
    "prompt": 1e-8,
    "completion": 2e-8,
    "name": "DeepSeek: Deepseek R1 0528 Qwen3 8B"
  },
  "deepseek-r1-0528-qwen3-8b": {
    "prompt": 1e-8,
    "completion": 2e-8
  },
  "deepseek/deepseek-r1-0528:free": {
    "prompt": 0,
    "completion": 0,
    "name": "DeepSeek: R1 0528 (free)"
  },
  "deepseek-r1-0528:free": {
    "prompt": 0,
    "completion": 0
  },
  "deepseek/deepseek-r1-0528": {
    "prompt": 2.72e-7,
    "completion": 2.72e-7,
    "name": "DeepSeek: R1 0528"
  },
  "deepseek-r1-0528": {
    "prompt": 2.72e-7,
    "completion": 2.72e-7
  },
  "sarvamai/sarvam-m:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Sarvam AI: Sarvam-M (free)"
  },
  "sarvam-m:free": {
    "prompt": 0,
    "completion": 0
  },
  "sarvamai/sarvam-m": {
    "prompt": 2.2e-8,
    "completion": 2.2e-8,
    "name": "Sarvam AI: Sarvam-M"
  },
  "sarvam-m": {
    "prompt": 2.2e-8,
    "completion": 2.2e-8
  },
  "thedrummer/valkyrie-49b-v1": {
    "prompt": 6.5e-7,
    "completion": 0.000001,
    "name": "TheDrummer: Valkyrie 49B V1"
  },
  "valkyrie-49b-v1": {
    "prompt": 6.5e-7,
    "completion": 0.000001
  },
  "anthropic/claude-opus-4": {
    "prompt": 0.000015,
    "completion": 0.000075,
    "name": "Anthropic: Claude Opus 4"
  },
  "claude-opus-4": {
    "prompt": 0.000015,
    "completion": 0.000075
  },
  "claude-3-opus": {
    "prompt": 0.000015,
    "completion": 0.000075
  },
  "anthropic/claude-sonnet-4": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude Sonnet 4"
  },
  "claude-sonnet-4": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "mistralai/devstral-small-2505:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Mistral: Devstral Small 2505 (free)"
  },
  "devstral-small-2505:free": {
    "prompt": 0,
    "completion": 0
  },
  "mistralai/devstral-small-2505": {
    "prompt": 3e-8,
    "completion": 3e-8,
    "name": "Mistral: Devstral Small 2505"
  },
  "devstral-small-2505": {
    "prompt": 3e-8,
    "completion": 3e-8
  },
  "google/gemma-3n-e4b-it:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Google: Gemma 3n 4B (free)"
  },
  "gemma-3n-e4b-it:free": {
    "prompt": 0,
    "completion": 0
  },
  "google/gemma-3n-e4b-it": {
    "prompt": 2e-8,
    "completion": 4e-8,
    "name": "Google: Gemma 3n 4B"
  },
  "gemma-3n-e4b-it": {
    "prompt": 2e-8,
    "completion": 4e-8
  },
  "openai/codex-mini": {
    "prompt": 0.0000015,
    "completion": 0.000006,
    "name": "OpenAI: Codex Mini"
  },
  "codex-mini": {
    "prompt": 0.0000015,
    "completion": 0.000006
  },
  "nousresearch/deephermes-3-mistral-24b-preview": {
    "prompt": 1.41e-7,
    "completion": 1.41e-7,
    "name": "Nous: DeepHermes 3 Mistral 24B Preview"
  },
  "deephermes-3-mistral-24b-preview": {
    "prompt": 1.41e-7,
    "completion": 1.41e-7
  },
  "mistralai/mistral-medium-3": {
    "prompt": 4e-7,
    "completion": 0.000002,
    "name": "Mistral: Mistral Medium 3"
  },
  "mistral-medium-3": {
    "prompt": 4e-7,
    "completion": 0.000002
  },
  "google/gemini-2.5-pro-preview-05-06": {
    "prompt": 0.00000125,
    "completion": 0.00001,
    "name": "Google: Gemini 2.5 Pro Preview 05-06"
  },
  "gemini-2.5-pro-preview-05-06": {
    "prompt": 0.00000125,
    "completion": 0.00001
  },
  "arcee-ai/caller-large": {
    "prompt": 5.5e-7,
    "completion": 8.5e-7,
    "name": "Arcee AI: Caller Large"
  },
  "caller-large": {
    "prompt": 5.5e-7,
    "completion": 8.5e-7
  },
  "arcee-ai/spotlight": {
    "prompt": 1.8e-7,
    "completion": 1.8e-7,
    "name": "Arcee AI: Spotlight"
  },
  "spotlight": {
    "prompt": 1.8e-7,
    "completion": 1.8e-7
  },
  "arcee-ai/maestro-reasoning": {
    "prompt": 9e-7,
    "completion": 0.0000033,
    "name": "Arcee AI: Maestro Reasoning"
  },
  "maestro-reasoning": {
    "prompt": 9e-7,
    "completion": 0.0000033
  },
  "arcee-ai/virtuoso-large": {
    "prompt": 7.5e-7,
    "completion": 0.0000012,
    "name": "Arcee AI: Virtuoso Large"
  },
  "virtuoso-large": {
    "prompt": 7.5e-7,
    "completion": 0.0000012
  },
  "arcee-ai/coder-large": {
    "prompt": 5e-7,
    "completion": 8e-7,
    "name": "Arcee AI: Coder Large"
  },
  "coder-large": {
    "prompt": 5e-7,
    "completion": 8e-7
  },
  "arcee-ai/virtuoso-medium-v2": {
    "prompt": 5e-7,
    "completion": 8e-7,
    "name": "Arcee AI: Virtuoso Medium V2"
  },
  "virtuoso-medium-v2": {
    "prompt": 5e-7,
    "completion": 8e-7
  },
  "arcee-ai/arcee-blitz": {
    "prompt": 4.5e-7,
    "completion": 7.5e-7,
    "name": "Arcee AI: Arcee Blitz"
  },
  "arcee-blitz": {
    "prompt": 4.5e-7,
    "completion": 7.5e-7
  },
  "microsoft/phi-4-reasoning-plus": {
    "prompt": 7e-8,
    "completion": 3.5e-7,
    "name": "Microsoft: Phi 4 Reasoning Plus"
  },
  "phi-4-reasoning-plus": {
    "prompt": 7e-8,
    "completion": 3.5e-7
  },
  "inception/mercury-coder": {
    "prompt": 2.5e-7,
    "completion": 0.000001,
    "name": "Inception: Mercury Coder"
  },
  "mercury-coder": {
    "prompt": 2.5e-7,
    "completion": 0.000001
  },
  "qwen/qwen3-4b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: Qwen3 4B (free)"
  },
  "qwen3-4b:free": {
    "prompt": 0,
    "completion": 0
  },
  "opengvlab/internvl3-14b": {
    "prompt": 2e-7,
    "completion": 4e-7,
    "name": "OpenGVLab: InternVL3 14B"
  },
  "internvl3-14b": {
    "prompt": 2e-7,
    "completion": 4e-7
  },
  "deepseek/deepseek-prover-v2": {
    "prompt": 5e-7,
    "completion": 0.00000218,
    "name": "DeepSeek: DeepSeek Prover V2"
  },
  "deepseek-prover-v2": {
    "prompt": 5e-7,
    "completion": 0.00000218
  },
  "meta-llama/llama-guard-4-12b": {
    "prompt": 5e-8,
    "completion": 5e-8,
    "name": "Meta: Llama Guard 4 12B"
  },
  "llama-guard-4-12b": {
    "prompt": 5e-8,
    "completion": 5e-8
  },
  "qwen/qwen3-30b-a3b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: Qwen3 30B A3B (free)"
  },
  "qwen3-30b-a3b:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen3-30b-a3b": {
    "prompt": 8e-8,
    "completion": 2.9e-7,
    "name": "Qwen: Qwen3 30B A3B"
  },
  "qwen3-30b-a3b": {
    "prompt": 8e-8,
    "completion": 2.9e-7
  },
  "qwen/qwen3-8b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: Qwen3 8B (free)"
  },
  "qwen3-8b:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen3-8b": {
    "prompt": 3.5e-8,
    "completion": 1.38e-7,
    "name": "Qwen: Qwen3 8B"
  },
  "qwen3-8b": {
    "prompt": 3.5e-8,
    "completion": 1.38e-7
  },
  "qwen/qwen3-14b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: Qwen3 14B (free)"
  },
  "qwen3-14b:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen3-14b": {
    "prompt": 6e-8,
    "completion": 2.4e-7,
    "name": "Qwen: Qwen3 14B"
  },
  "qwen3-14b": {
    "prompt": 6e-8,
    "completion": 2.4e-7
  },
  "qwen/qwen3-32b": {
    "prompt": 2.7e-8,
    "completion": 2.7e-8,
    "name": "Qwen: Qwen3 32B"
  },
  "qwen3-32b": {
    "prompt": 2.7e-8,
    "completion": 2.7e-8
  },
  "qwen/qwen3-235b-a22b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: Qwen3 235B A22B (free)"
  },
  "qwen3-235b-a22b:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen3-235b-a22b": {
    "prompt": 1.3e-7,
    "completion": 6e-7,
    "name": "Qwen: Qwen3 235B A22B"
  },
  "qwen3-235b-a22b": {
    "prompt": 1.3e-7,
    "completion": 6e-7
  },
  "tngtech/deepseek-r1t-chimera:free": {
    "prompt": 0,
    "completion": 0,
    "name": "TNG: DeepSeek R1T Chimera (free)"
  },
  "deepseek-r1t-chimera:free": {
    "prompt": 0,
    "completion": 0
  },
  "microsoft/mai-ds-r1:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Microsoft: MAI DS R1 (free)"
  },
  "mai-ds-r1:free": {
    "prompt": 0,
    "completion": 0
  },
  "microsoft/mai-ds-r1": {
    "prompt": 3.02e-7,
    "completion": 3.02e-7,
    "name": "Microsoft: MAI DS R1"
  },
  "mai-ds-r1": {
    "prompt": 3.02e-7,
    "completion": 3.02e-7
  },
  "thudm/glm-z1-32b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "THUDM: GLM Z1 32B (free)"
  },
  "glm-z1-32b:free": {
    "prompt": 0,
    "completion": 0
  },
  "thudm/glm-z1-32b": {
    "prompt": 3e-8,
    "completion": 3e-8,
    "name": "THUDM: GLM Z1 32B"
  },
  "glm-z1-32b": {
    "prompt": 3e-8,
    "completion": 3e-8
  },
  "thudm/glm-4-32b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "THUDM: GLM 4 32B (free)"
  },
  "glm-4-32b:free": {
    "prompt": 0,
    "completion": 0
  },
  "thudm/glm-4-32b": {
    "prompt": 2.4e-7,
    "completion": 2.4e-7,
    "name": "THUDM: GLM 4 32B"
  },
  "glm-4-32b": {
    "prompt": 2.4e-7,
    "completion": 2.4e-7
  },
  "openai/o4-mini-high": {
    "prompt": 0.0000011,
    "completion": 0.0000044,
    "name": "OpenAI: o4 Mini High"
  },
  "o4-mini-high": {
    "prompt": 0.0000011,
    "completion": 0.0000044
  },
  "openai/o3": {
    "prompt": 0.000002,
    "completion": 0.000008,
    "name": "OpenAI: o3"
  },
  "o3": {
    "prompt": 0.000002,
    "completion": 0.000008
  },
  "openai/o4-mini": {
    "prompt": 0.0000011,
    "completion": 0.0000044,
    "name": "OpenAI: o4 Mini"
  },
  "o4-mini": {
    "prompt": 0.0000011,
    "completion": 0.0000044
  },
  "shisa-ai/shisa-v2-llama3.3-70b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Shisa AI: Shisa V2 Llama 3.3 70B  (free)"
  },
  "shisa-v2-llama3.3-70b:free": {
    "prompt": 0,
    "completion": 0
  },
  "shisa-ai/shisa-v2-llama3.3-70b": {
    "prompt": 3e-8,
    "completion": 3e-8,
    "name": "Shisa AI: Shisa V2 Llama 3.3 70B"
  },
  "shisa-v2-llama3.3-70b": {
    "prompt": 3e-8,
    "completion": 3e-8
  },
  "openai/gpt-4.1": {
    "prompt": 0.000002,
    "completion": 0.000008,
    "name": "OpenAI: GPT-4.1"
  },
  "gpt-4.1": {
    "prompt": 0.000002,
    "completion": 0.000008
  },
  "gpt-4": {
    "prompt": 0.00003,
    "completion": 0.00006
  },
  "openai/gpt-4.1-mini": {
    "prompt": 4e-7,
    "completion": 0.0000016,
    "name": "OpenAI: GPT-4.1 Mini"
  },
  "gpt-4.1-mini": {
    "prompt": 4e-7,
    "completion": 0.0000016
  },
  "openai/gpt-4.1-nano": {
    "prompt": 1e-7,
    "completion": 4e-7,
    "name": "OpenAI: GPT-4.1 Nano"
  },
  "gpt-4.1-nano": {
    "prompt": 1e-7,
    "completion": 4e-7
  },
  "eleutherai/llemma_7b": {
    "prompt": 8e-7,
    "completion": 0.0000012,
    "name": "EleutherAI: Llemma 7b"
  },
  "llemma_7b": {
    "prompt": 8e-7,
    "completion": 0.0000012
  },
  "alfredpros/codellama-7b-instruct-solidity": {
    "prompt": 8e-7,
    "completion": 0.0000012,
    "name": "AlfredPros: CodeLLaMa 7B Instruct Solidity"
  },
  "codellama-7b-instruct-solidity": {
    "prompt": 8e-7,
    "completion": 0.0000012
  },
  "arliai/qwq-32b-arliai-rpr-v1:free": {
    "prompt": 0,
    "completion": 0,
    "name": "ArliAI: QwQ 32B RpR v1 (free)"
  },
  "qwq-32b-arliai-rpr-v1:free": {
    "prompt": 0,
    "completion": 0
  },
  "arliai/qwq-32b-arliai-rpr-v1": {
    "prompt": 1.5e-8,
    "completion": 1.5e-8,
    "name": "ArliAI: QwQ 32B RpR v1"
  },
  "qwq-32b-arliai-rpr-v1": {
    "prompt": 1.5e-8,
    "completion": 1.5e-8
  },
  "agentica-org/deepcoder-14b-preview:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Agentica: Deepcoder 14B Preview (free)"
  },
  "deepcoder-14b-preview:free": {
    "prompt": 0,
    "completion": 0
  },
  "agentica-org/deepcoder-14b-preview": {
    "prompt": 1.5e-8,
    "completion": 1.5e-8,
    "name": "Agentica: Deepcoder 14B Preview"
  },
  "deepcoder-14b-preview": {
    "prompt": 1.5e-8,
    "completion": 1.5e-8
  },
  "moonshotai/kimi-vl-a3b-thinking:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Moonshot AI: Kimi VL A3B Thinking (free)"
  },
  "kimi-vl-a3b-thinking:free": {
    "prompt": 0,
    "completion": 0
  },
  "moonshotai/kimi-vl-a3b-thinking": {
    "prompt": 3.8e-8,
    "completion": 3.8e-8,
    "name": "Moonshot AI: Kimi VL A3B Thinking"
  },
  "kimi-vl-a3b-thinking": {
    "prompt": 3.8e-8,
    "completion": 3.8e-8
  },
  "x-ai/grok-3-mini-beta": {
    "prompt": 3e-7,
    "completion": 5e-7,
    "name": "xAI: Grok 3 Mini Beta"
  },
  "grok-3-mini-beta": {
    "prompt": 3e-7,
    "completion": 5e-7
  },
  "x-ai/grok-3-beta": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "xAI: Grok 3 Beta"
  },
  "grok-3-beta": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "nvidia/llama-3.3-nemotron-super-49b-v1": {
    "prompt": 1.3e-7,
    "completion": 4e-7,
    "name": "NVIDIA: Llama 3.3 Nemotron Super 49B v1"
  },
  "llama-3.3-nemotron-super-49b-v1": {
    "prompt": 1.3e-7,
    "completion": 4e-7
  },
  "nvidia/llama-3.1-nemotron-ultra-253b-v1:free": {
    "prompt": 0,
    "completion": 0,
    "name": "NVIDIA: Llama 3.1 Nemotron Ultra 253B v1 (free)"
  },
  "llama-3.1-nemotron-ultra-253b-v1:free": {
    "prompt": 0,
    "completion": 0
  },
  "nvidia/llama-3.1-nemotron-ultra-253b-v1": {
    "prompt": 6e-7,
    "completion": 0.0000018,
    "name": "NVIDIA: Llama 3.1 Nemotron Ultra 253B v1"
  },
  "llama-3.1-nemotron-ultra-253b-v1": {
    "prompt": 6e-7,
    "completion": 0.0000018
  },
  "meta-llama/llama-4-maverick": {
    "prompt": 1.5e-7,
    "completion": 6e-7,
    "name": "Meta: Llama 4 Maverick"
  },
  "llama-4-maverick": {
    "prompt": 1.5e-7,
    "completion": 6e-7
  },
  "meta-llama/llama-4-scout": {
    "prompt": 8e-8,
    "completion": 3e-7,
    "name": "Meta: Llama 4 Scout"
  },
  "llama-4-scout": {
    "prompt": 8e-8,
    "completion": 3e-7
  },
  "scb10x/llama3.1-typhoon2-70b-instruct": {
    "prompt": 8.8e-7,
    "completion": 8.8e-7,
    "name": "Typhoon2 70B Instruct"
  },
  "llama3.1-typhoon2-70b-instruct": {
    "prompt": 8.8e-7,
    "completion": 8.8e-7
  },
  "google/gemini-2.5-pro-exp-03-25": {
    "prompt": 0,
    "completion": 0,
    "name": "Google: Gemini 2.5 Pro Experimental"
  },
  "gemini-2.5-pro-exp-03-25": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen2.5-vl-32b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: Qwen2.5 VL 32B Instruct (free)"
  },
  "qwen2.5-vl-32b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen2.5-vl-32b-instruct": {
    "prompt": 2e-7,
    "completion": 6e-7,
    "name": "Qwen: Qwen2.5 VL 32B Instruct"
  },
  "qwen2.5-vl-32b-instruct": {
    "prompt": 2e-7,
    "completion": 6e-7
  },
  "deepseek/deepseek-chat-v3-0324:free": {
    "prompt": 0,
    "completion": 0,
    "name": "DeepSeek: DeepSeek V3 0324 (free)"
  },
  "deepseek-chat-v3-0324:free": {
    "prompt": 0,
    "completion": 0
  },
  "deepseek/deepseek-chat-v3-0324": {
    "prompt": 2.5e-7,
    "completion": 8.5e-7,
    "name": "DeepSeek: DeepSeek V3 0324"
  },
  "deepseek-chat-v3-0324": {
    "prompt": 2.5e-7,
    "completion": 8.5e-7
  },
  "featherless/qwerky-72b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwerky 72B (free)"
  },
  "qwerky-72b:free": {
    "prompt": 0,
    "completion": 0
  },
  "openai/o1-pro": {
    "prompt": 0.00015,
    "completion": 0.0006,
    "name": "OpenAI: o1-pro"
  },
  "o1-pro": {
    "prompt": 0.00015,
    "completion": 0.0006
  },
  "mistralai/mistral-small-3.1-24b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Mistral: Mistral Small 3.1 24B (free)"
  },
  "mistral-small-3.1-24b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "mistralai/mistral-small-3.1-24b-instruct": {
    "prompt": 2.7e-8,
    "completion": 2.7e-8,
    "name": "Mistral: Mistral Small 3.1 24B"
  },
  "mistral-small-3.1-24b-instruct": {
    "prompt": 2.7e-8,
    "completion": 2.7e-8
  },
  "google/gemma-3-4b-it:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Google: Gemma 3 4B (free)"
  },
  "gemma-3-4b-it:free": {
    "prompt": 0,
    "completion": 0
  },
  "google/gemma-3-4b-it": {
    "prompt": 2e-8,
    "completion": 4e-8,
    "name": "Google: Gemma 3 4B"
  },
  "gemma-3-4b-it": {
    "prompt": 2e-8,
    "completion": 4e-8
  },
  "ai21/jamba-1.6-large": {
    "prompt": 0.000002,
    "completion": 0.000008,
    "name": "AI21: Jamba 1.6 Large"
  },
  "jamba-1.6-large": {
    "prompt": 0.000002,
    "completion": 0.000008
  },
  "ai21/jamba-1.6-mini": {
    "prompt": 2e-7,
    "completion": 4e-7,
    "name": "AI21: Jamba Mini 1.6"
  },
  "jamba-1.6-mini": {
    "prompt": 2e-7,
    "completion": 4e-7
  },
  "google/gemma-3-12b-it:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Google: Gemma 3 12B (free)"
  },
  "gemma-3-12b-it:free": {
    "prompt": 0,
    "completion": 0
  },
  "google/gemma-3-12b-it": {
    "prompt": 3e-8,
    "completion": 3e-8,
    "name": "Google: Gemma 3 12B"
  },
  "gemma-3-12b-it": {
    "prompt": 3e-8,
    "completion": 3e-8
  },
  "cohere/command-a": {
    "prompt": 0.0000025,
    "completion": 0.00001,
    "name": "Cohere: Command A"
  },
  "command-a": {
    "prompt": 0.0000025,
    "completion": 0.00001
  },
  "openai/gpt-4o-mini-search-preview": {
    "prompt": 1.5e-7,
    "completion": 6e-7,
    "name": "OpenAI: GPT-4o-mini Search Preview"
  },
  "gpt-4o-mini-search-preview": {
    "prompt": 1.5e-7,
    "completion": 6e-7
  },
  "openai/gpt-4o-search-preview": {
    "prompt": 0.0000025,
    "completion": 0.00001,
    "name": "OpenAI: GPT-4o Search Preview"
  },
  "gpt-4o-search-preview": {
    "prompt": 0.0000025,
    "completion": 0.00001
  },
  "rekaai/reka-flash-3:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Reka: Flash 3 (free)"
  },
  "reka-flash-3:free": {
    "prompt": 0,
    "completion": 0
  },
  "rekaai/reka-flash-3": {
    "prompt": 1.3e-8,
    "completion": 1.3e-8,
    "name": "Reka: Flash 3"
  },
  "reka-flash-3": {
    "prompt": 1.3e-8,
    "completion": 1.3e-8
  },
  "google/gemma-3-27b-it:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Google: Gemma 3 27B (free)"
  },
  "gemma-3-27b-it:free": {
    "prompt": 0,
    "completion": 0
  },
  "google/gemma-3-27b-it": {
    "prompt": 9e-8,
    "completion": 1.7e-7,
    "name": "Google: Gemma 3 27B"
  },
  "gemma-3-27b-it": {
    "prompt": 9e-8,
    "completion": 1.7e-7
  },
  "thedrummer/anubis-pro-105b-v1": {
    "prompt": 5e-7,
    "completion": 0.000001,
    "name": "TheDrummer: Anubis Pro 105B V1"
  },
  "anubis-pro-105b-v1": {
    "prompt": 5e-7,
    "completion": 0.000001
  },
  "thedrummer/skyfall-36b-v2": {
    "prompt": 4e-7,
    "completion": 7e-7,
    "name": "TheDrummer: Skyfall 36B V2"
  },
  "skyfall-36b-v2": {
    "prompt": 4e-7,
    "completion": 7e-7
  },
  "microsoft/phi-4-multimodal-instruct": {
    "prompt": 5e-8,
    "completion": 1e-7,
    "name": "Microsoft: Phi 4 Multimodal Instruct"
  },
  "phi-4-multimodal-instruct": {
    "prompt": 5e-8,
    "completion": 1e-7
  },
  "perplexity/sonar-reasoning-pro": {
    "prompt": 0.000002,
    "completion": 0.000008,
    "name": "Perplexity: Sonar Reasoning Pro"
  },
  "sonar-reasoning-pro": {
    "prompt": 0.000002,
    "completion": 0.000008
  },
  "perplexity/sonar-pro": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Perplexity: Sonar Pro"
  },
  "sonar-pro": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "perplexity/sonar-deep-research": {
    "prompt": 0.000002,
    "completion": 0.000008,
    "name": "Perplexity: Sonar Deep Research"
  },
  "sonar-deep-research": {
    "prompt": 0.000002,
    "completion": 0.000008
  },
  "qwen/qwq-32b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: QwQ 32B (free)"
  },
  "qwq-32b:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwq-32b": {
    "prompt": 7.5e-8,
    "completion": 1.5e-7,
    "name": "Qwen: QwQ 32B"
  },
  "qwq-32b": {
    "prompt": 7.5e-8,
    "completion": 1.5e-7
  },
  "nousresearch/deephermes-3-llama-3-8b-preview:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Nous: DeepHermes 3 Llama 3 8B Preview (free)"
  },
  "deephermes-3-llama-3-8b-preview:free": {
    "prompt": 0,
    "completion": 0
  },
  "google/gemini-2.0-flash-lite-001": {
    "prompt": 7.5e-8,
    "completion": 3e-7,
    "name": "Google: Gemini 2.0 Flash Lite"
  },
  "gemini-2.0-flash-lite-001": {
    "prompt": 7.5e-8,
    "completion": 3e-7
  },
  "anthropic/claude-3.7-sonnet": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude 3.7 Sonnet"
  },
  "claude-3.7-sonnet": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "anthropic/claude-3.7-sonnet:thinking": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude 3.7 Sonnet (thinking)"
  },
  "claude-3.7-sonnet:thinking": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "anthropic/claude-3.7-sonnet:beta": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude 3.7 Sonnet (self-moderated)"
  },
  "claude-3.7-sonnet:beta": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "perplexity/r1-1776": {
    "prompt": 0.000002,
    "completion": 0.000008,
    "name": "Perplexity: R1 1776"
  },
  "r1-1776": {
    "prompt": 0.000002,
    "completion": 0.000008
  },
  "mistralai/mistral-saba": {
    "prompt": 2e-7,
    "completion": 6e-7,
    "name": "Mistral: Saba"
  },
  "mistral-saba": {
    "prompt": 2e-7,
    "completion": 6e-7
  },
  "cognitivecomputations/dolphin3.0-r1-mistral-24b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Dolphin3.0 R1 Mistral 24B (free)"
  },
  "dolphin3.0-r1-mistral-24b:free": {
    "prompt": 0,
    "completion": 0
  },
  "cognitivecomputations/dolphin3.0-r1-mistral-24b": {
    "prompt": 1.3e-8,
    "completion": 1.3e-8,
    "name": "Dolphin3.0 R1 Mistral 24B"
  },
  "dolphin3.0-r1-mistral-24b": {
    "prompt": 1.3e-8,
    "completion": 1.3e-8
  },
  "cognitivecomputations/dolphin3.0-mistral-24b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Dolphin3.0 Mistral 24B (free)"
  },
  "dolphin3.0-mistral-24b:free": {
    "prompt": 0,
    "completion": 0
  },
  "meta-llama/llama-guard-3-8b": {
    "prompt": 2e-8,
    "completion": 6e-8,
    "name": "Llama Guard 3 8B"
  },
  "llama-guard-3-8b": {
    "prompt": 2e-8,
    "completion": 6e-8
  },
  "openai/o3-mini-high": {
    "prompt": 0.0000011,
    "completion": 0.0000044,
    "name": "OpenAI: o3 Mini High"
  },
  "o3-mini-high": {
    "prompt": 0.0000011,
    "completion": 0.0000044
  },
  "deepseek/deepseek-r1-distill-llama-8b": {
    "prompt": 4e-8,
    "completion": 4e-8,
    "name": "DeepSeek: R1 Distill Llama 8B"
  },
  "deepseek-r1-distill-llama-8b": {
    "prompt": 4e-8,
    "completion": 4e-8
  },
  "google/gemini-2.0-flash-001": {
    "prompt": 1e-7,
    "completion": 4e-7,
    "name": "Google: Gemini 2.0 Flash"
  },
  "gemini-2.0-flash-001": {
    "prompt": 1e-7,
    "completion": 4e-7
  },
  "qwen/qwen-vl-plus": {
    "prompt": 2.1e-7,
    "completion": 6.3e-7,
    "name": "Qwen: Qwen VL Plus"
  },
  "qwen-vl-plus": {
    "prompt": 2.1e-7,
    "completion": 6.3e-7
  },
  "aion-labs/aion-1.0": {
    "prompt": 0.000004,
    "completion": 0.000008,
    "name": "AionLabs: Aion-1.0"
  },
  "aion-1.0": {
    "prompt": 0.000004,
    "completion": 0.000008
  },
  "aion-labs/aion-1.0-mini": {
    "prompt": 7e-7,
    "completion": 0.0000014,
    "name": "AionLabs: Aion-1.0-Mini"
  },
  "aion-1.0-mini": {
    "prompt": 7e-7,
    "completion": 0.0000014
  },
  "aion-labs/aion-rp-llama-3.1-8b": {
    "prompt": 2e-7,
    "completion": 2e-7,
    "name": "AionLabs: Aion-RP 1.0 (8B)"
  },
  "aion-rp-llama-3.1-8b": {
    "prompt": 2e-7,
    "completion": 2e-7
  },
  "qwen/qwen-vl-max": {
    "prompt": 8e-7,
    "completion": 0.0000032,
    "name": "Qwen: Qwen VL Max"
  },
  "qwen-vl-max": {
    "prompt": 8e-7,
    "completion": 0.0000032
  },
  "qwen/qwen-turbo": {
    "prompt": 5e-8,
    "completion": 2e-7,
    "name": "Qwen: Qwen-Turbo"
  },
  "qwen-turbo": {
    "prompt": 5e-8,
    "completion": 2e-7
  },
  "qwen/qwen2.5-vl-72b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen: Qwen2.5 VL 72B Instruct (free)"
  },
  "qwen2.5-vl-72b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen2.5-vl-72b-instruct": {
    "prompt": 2.5e-7,
    "completion": 7.5e-7,
    "name": "Qwen: Qwen2.5 VL 72B Instruct"
  },
  "qwen2.5-vl-72b-instruct": {
    "prompt": 2.5e-7,
    "completion": 7.5e-7
  },
  "qwen/qwen-plus": {
    "prompt": 4e-7,
    "completion": 0.0000012,
    "name": "Qwen: Qwen-Plus"
  },
  "qwen-plus": {
    "prompt": 4e-7,
    "completion": 0.0000012
  },
  "qwen/qwen-max": {
    "prompt": 0.0000016,
    "completion": 0.0000064,
    "name": "Qwen: Qwen-Max"
  },
  "qwen-max": {
    "prompt": 0.0000016,
    "completion": 0.0000064
  },
  "openai/o3-mini": {
    "prompt": 0.0000011,
    "completion": 0.0000044,
    "name": "OpenAI: o3 Mini"
  },
  "o3-mini": {
    "prompt": 0.0000011,
    "completion": 0.0000044
  },
  "deepseek/deepseek-r1-distill-qwen-1.5b": {
    "prompt": 1.8e-7,
    "completion": 1.8e-7,
    "name": "DeepSeek: R1 Distill Qwen 1.5B"
  },
  "deepseek-r1-distill-qwen-1.5b": {
    "prompt": 1.8e-7,
    "completion": 1.8e-7
  },
  "mistralai/mistral-small-24b-instruct-2501:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Mistral: Mistral Small 3 (free)"
  },
  "mistral-small-24b-instruct-2501:free": {
    "prompt": 0,
    "completion": 0
  },
  "mistralai/mistral-small-24b-instruct-2501": {
    "prompt": 3e-8,
    "completion": 3e-8,
    "name": "Mistral: Mistral Small 3"
  },
  "mistral-small-24b-instruct-2501": {
    "prompt": 3e-8,
    "completion": 3e-8
  },
  "deepseek/deepseek-r1-distill-qwen-32b": {
    "prompt": 7.5e-8,
    "completion": 1.5e-7,
    "name": "DeepSeek: R1 Distill Qwen 32B"
  },
  "deepseek-r1-distill-qwen-32b": {
    "prompt": 7.5e-8,
    "completion": 1.5e-7
  },
  "deepseek/deepseek-r1-distill-qwen-14b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "DeepSeek: R1 Distill Qwen 14B (free)"
  },
  "deepseek-r1-distill-qwen-14b:free": {
    "prompt": 0,
    "completion": 0
  },
  "deepseek/deepseek-r1-distill-qwen-14b": {
    "prompt": 1.5e-7,
    "completion": 1.5e-7,
    "name": "DeepSeek: R1 Distill Qwen 14B"
  },
  "deepseek-r1-distill-qwen-14b": {
    "prompt": 1.5e-7,
    "completion": 1.5e-7
  },
  "perplexity/sonar-reasoning": {
    "prompt": 0.000001,
    "completion": 0.000005,
    "name": "Perplexity: Sonar Reasoning"
  },
  "sonar-reasoning": {
    "prompt": 0.000001,
    "completion": 0.000005
  },
  "perplexity/sonar": {
    "prompt": 0.000001,
    "completion": 0.000001,
    "name": "Perplexity: Sonar"
  },
  "sonar": {
    "prompt": 0.000001,
    "completion": 0.000001
  },
  "liquid/lfm-7b": {
    "prompt": 1e-8,
    "completion": 1e-8,
    "name": "Liquid: LFM 7B"
  },
  "lfm-7b": {
    "prompt": 1e-8,
    "completion": 1e-8
  },
  "liquid/lfm-3b": {
    "prompt": 2e-8,
    "completion": 2e-8,
    "name": "Liquid: LFM 3B"
  },
  "lfm-3b": {
    "prompt": 2e-8,
    "completion": 2e-8
  },
  "deepseek/deepseek-r1-distill-llama-70b:free": {
    "prompt": 0,
    "completion": 0,
    "name": "DeepSeek: R1 Distill Llama 70B (free)"
  },
  "deepseek-r1-distill-llama-70b:free": {
    "prompt": 0,
    "completion": 0
  },
  "deepseek/deepseek-r1-distill-llama-70b": {
    "prompt": 5e-8,
    "completion": 5e-8,
    "name": "DeepSeek: R1 Distill Llama 70B"
  },
  "deepseek-r1-distill-llama-70b": {
    "prompt": 5e-8,
    "completion": 5e-8
  },
  "deepseek/deepseek-r1:free": {
    "prompt": 0,
    "completion": 0,
    "name": "DeepSeek: R1 (free)"
  },
  "deepseek-r1:free": {
    "prompt": 0,
    "completion": 0
  },
  "deepseek/deepseek-r1": {
    "prompt": 4e-7,
    "completion": 0.000002,
    "name": "DeepSeek: R1"
  },
  "deepseek-r1": {
    "prompt": 4e-7,
    "completion": 0.000002
  },
  "minimax/minimax-01": {
    "prompt": 2e-7,
    "completion": 0.0000011,
    "name": "MiniMax: MiniMax-01"
  },
  "minimax-01": {
    "prompt": 2e-7,
    "completion": 0.0000011
  },
  "mistralai/codestral-2501": {
    "prompt": 3e-7,
    "completion": 9e-7,
    "name": "Mistral: Codestral 2501"
  },
  "codestral-2501": {
    "prompt": 3e-7,
    "completion": 9e-7
  },
  "microsoft/phi-4": {
    "prompt": 7e-8,
    "completion": 1.4e-7,
    "name": "Microsoft: Phi 4"
  },
  "phi-4": {
    "prompt": 7e-8,
    "completion": 1.4e-7
  },
  "deepseek/deepseek-chat": {
    "prompt": 2.72e-7,
    "completion": 2.72e-7,
    "name": "DeepSeek: DeepSeek V3"
  },
  "deepseek-chat": {
    "prompt": 2.72e-7,
    "completion": 2.72e-7
  },
  "sao10k/l3.3-euryale-70b": {
    "prompt": 6.5e-7,
    "completion": 7.5e-7,
    "name": "Sao10K: Llama 3.3 Euryale 70B"
  },
  "l3.3-euryale-70b": {
    "prompt": 6.5e-7,
    "completion": 7.5e-7
  },
  "openai/o1": {
    "prompt": 0.000015,
    "completion": 0.00006,
    "name": "OpenAI: o1"
  },
  "o1": {
    "prompt": 0.000015,
    "completion": 0.00006
  },
  "eva-unit-01/eva-llama-3.33-70b": {
    "prompt": 0.000004,
    "completion": 0.000006,
    "name": "EVA Llama 3.33 70B"
  },
  "eva-llama-3.33-70b": {
    "prompt": 0.000004,
    "completion": 0.000006
  },
  "x-ai/grok-2-vision-1212": {
    "prompt": 0.000002,
    "completion": 0.00001,
    "name": "xAI: Grok 2 Vision 1212"
  },
  "grok-2-vision-1212": {
    "prompt": 0.000002,
    "completion": 0.00001
  },
  "x-ai/grok-2-1212": {
    "prompt": 0.000002,
    "completion": 0.00001,
    "name": "xAI: Grok 2 1212"
  },
  "grok-2-1212": {
    "prompt": 0.000002,
    "completion": 0.00001
  },
  "cohere/command-r7b-12-2024": {
    "prompt": 3.75e-8,
    "completion": 1.5e-7,
    "name": "Cohere: Command R7B (12-2024)"
  },
  "command-r7b-12-2024": {
    "prompt": 3.75e-8,
    "completion": 1.5e-7
  },
  "google/gemini-2.0-flash-exp:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Google: Gemini 2.0 Flash Experimental (free)"
  },
  "gemini-2.0-flash-exp:free": {
    "prompt": 0,
    "completion": 0
  },
  "meta-llama/llama-3.3-70b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Meta: Llama 3.3 70B Instruct (free)"
  },
  "llama-3.3-70b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "meta-llama/llama-3.3-70b-instruct": {
    "prompt": 3.8e-8,
    "completion": 1.2e-7,
    "name": "Meta: Llama 3.3 70B Instruct"
  },
  "llama-3.3-70b-instruct": {
    "prompt": 3.8e-8,
    "completion": 1.2e-7
  },
  "amazon/nova-lite-v1": {
    "prompt": 6e-8,
    "completion": 2.4e-7,
    "name": "Amazon: Nova Lite 1.0"
  },
  "nova-lite-v1": {
    "prompt": 6e-8,
    "completion": 2.4e-7
  },
  "amazon/nova-micro-v1": {
    "prompt": 3.5e-8,
    "completion": 1.4e-7,
    "name": "Amazon: Nova Micro 1.0"
  },
  "nova-micro-v1": {
    "prompt": 3.5e-8,
    "completion": 1.4e-7
  },
  "amazon/nova-pro-v1": {
    "prompt": 8e-7,
    "completion": 0.0000032,
    "name": "Amazon: Nova Pro 1.0"
  },
  "nova-pro-v1": {
    "prompt": 8e-7,
    "completion": 0.0000032
  },
  "qwen/qwq-32b-preview": {
    "prompt": 2e-7,
    "completion": 2e-7,
    "name": "Qwen: QwQ 32B Preview"
  },
  "qwq-32b-preview": {
    "prompt": 2e-7,
    "completion": 2e-7
  },
  "eva-unit-01/eva-qwen-2.5-72b": {
    "prompt": 0.000004,
    "completion": 0.000006,
    "name": "EVA Qwen2.5 72B"
  },
  "eva-qwen-2.5-72b": {
    "prompt": 0.000004,
    "completion": 0.000006
  },
  "openai/gpt-4o-2024-11-20": {
    "prompt": 0.0000025,
    "completion": 0.00001,
    "name": "OpenAI: GPT-4o (2024-11-20)"
  },
  "gpt-4o-2024-11-20": {
    "prompt": 0.0000025,
    "completion": 0.00001
  },
  "mistralai/mistral-large-2411": {
    "prompt": 0.000002,
    "completion": 0.000006,
    "name": "Mistral Large 2411"
  },
  "mistral-large-2411": {
    "prompt": 0.000002,
    "completion": 0.000006
  },
  "mistralai/mistral-large-2407": {
    "prompt": 0.000002,
    "completion": 0.000006,
    "name": "Mistral Large 2407"
  },
  "mistral-large-2407": {
    "prompt": 0.000002,
    "completion": 0.000006
  },
  "mistralai/pixtral-large-2411": {
    "prompt": 0.000002,
    "completion": 0.000006,
    "name": "Mistral: Pixtral Large 2411"
  },
  "pixtral-large-2411": {
    "prompt": 0.000002,
    "completion": 0.000006
  },
  "x-ai/grok-vision-beta": {
    "prompt": 0.000005,
    "completion": 0.000015,
    "name": "xAI: Grok Vision Beta"
  },
  "grok-vision-beta": {
    "prompt": 0.000005,
    "completion": 0.000015
  },
  "infermatic/mn-inferor-12b": {
    "prompt": 8e-7,
    "completion": 0.0000012,
    "name": "Infermatic: Mistral Nemo Inferor 12B"
  },
  "mn-inferor-12b": {
    "prompt": 8e-7,
    "completion": 0.0000012
  },
  "qwen/qwen-2.5-coder-32b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen2.5 Coder 32B Instruct (free)"
  },
  "qwen-2.5-coder-32b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen-2.5-coder-32b-instruct": {
    "prompt": 6e-8,
    "completion": 1.5e-7,
    "name": "Qwen2.5 Coder 32B Instruct"
  },
  "qwen-2.5-coder-32b-instruct": {
    "prompt": 6e-8,
    "completion": 1.5e-7
  },
  "raifle/sorcererlm-8x22b": {
    "prompt": 0.0000045,
    "completion": 0.0000045,
    "name": "SorcererLM 8x22B"
  },
  "sorcererlm-8x22b": {
    "prompt": 0.0000045,
    "completion": 0.0000045
  },
  "thedrummer/unslopnemo-12b": {
    "prompt": 4e-7,
    "completion": 4e-7,
    "name": "TheDrummer: UnslopNemo 12B"
  },
  "unslopnemo-12b": {
    "prompt": 4e-7,
    "completion": 4e-7
  },
  "anthropic/claude-3.5-haiku-20241022:beta": {
    "prompt": 8e-7,
    "completion": 0.000004,
    "name": "Anthropic: Claude 3.5 Haiku (2024-10-22) (self-moderated)"
  },
  "claude-3.5-haiku-20241022:beta": {
    "prompt": 8e-7,
    "completion": 0.000004
  },
  "anthropic/claude-3.5-haiku-20241022": {
    "prompt": 8e-7,
    "completion": 0.000004,
    "name": "Anthropic: Claude 3.5 Haiku (2024-10-22)"
  },
  "claude-3.5-haiku-20241022": {
    "prompt": 8e-7,
    "completion": 0.000004
  },
  "anthropic/claude-3.5-haiku:beta": {
    "prompt": 8e-7,
    "completion": 0.000004,
    "name": "Anthropic: Claude 3.5 Haiku (self-moderated)"
  },
  "claude-3.5-haiku:beta": {
    "prompt": 8e-7,
    "completion": 0.000004
  },
  "anthropic/claude-3.5-haiku": {
    "prompt": 8e-7,
    "completion": 0.000004,
    "name": "Anthropic: Claude 3.5 Haiku"
  },
  "claude-3.5-haiku": {
    "prompt": 8e-7,
    "completion": 0.000004
  },
  "anthropic/claude-3.5-sonnet:beta": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude 3.5 Sonnet (self-moderated)"
  },
  "claude-3.5-sonnet:beta": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "anthropic/claude-3.5-sonnet": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude 3.5 Sonnet"
  },
  "claude-3.5-sonnet": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "anthracite-org/magnum-v4-72b": {
    "prompt": 0.0000025,
    "completion": 0.000003,
    "name": "Magnum v4 72B"
  },
  "magnum-v4-72b": {
    "prompt": 0.0000025,
    "completion": 0.000003
  },
  "mistralai/ministral-8b": {
    "prompt": 1e-7,
    "completion": 1e-7,
    "name": "Mistral: Ministral 8B"
  },
  "ministral-8b": {
    "prompt": 1e-7,
    "completion": 1e-7
  },
  "mistralai/ministral-3b": {
    "prompt": 4e-8,
    "completion": 4e-8,
    "name": "Mistral: Ministral 3B"
  },
  "ministral-3b": {
    "prompt": 4e-8,
    "completion": 4e-8
  },
  "qwen/qwen-2.5-7b-instruct": {
    "prompt": 4e-8,
    "completion": 1e-7,
    "name": "Qwen2.5 7B Instruct"
  },
  "qwen-2.5-7b-instruct": {
    "prompt": 4e-8,
    "completion": 1e-7
  },
  "nvidia/llama-3.1-nemotron-70b-instruct": {
    "prompt": 1.2e-7,
    "completion": 3e-7,
    "name": "NVIDIA: Llama 3.1 Nemotron 70B Instruct"
  },
  "llama-3.1-nemotron-70b-instruct": {
    "prompt": 1.2e-7,
    "completion": 3e-7
  },
  "inflection/inflection-3-pi": {
    "prompt": 0.0000025,
    "completion": 0.00001,
    "name": "Inflection: Inflection 3 Pi"
  },
  "inflection-3-pi": {
    "prompt": 0.0000025,
    "completion": 0.00001
  },
  "inflection/inflection-3-productivity": {
    "prompt": 0.0000025,
    "completion": 0.00001,
    "name": "Inflection: Inflection 3 Productivity"
  },
  "inflection-3-productivity": {
    "prompt": 0.0000025,
    "completion": 0.00001
  },
  "google/gemini-flash-1.5-8b": {
    "prompt": 3.75e-8,
    "completion": 1.5e-7,
    "name": "Google: Gemini 1.5 Flash 8B"
  },
  "gemini-flash-1.5-8b": {
    "prompt": 3.75e-8,
    "completion": 1.5e-7
  },
  "thedrummer/rocinante-12b": {
    "prompt": 2e-7,
    "completion": 5e-7,
    "name": "TheDrummer: Rocinante 12B"
  },
  "rocinante-12b": {
    "prompt": 2e-7,
    "completion": 5e-7
  },
  "liquid/lfm-40b": {
    "prompt": 1.5e-7,
    "completion": 1.5e-7,
    "name": "Liquid: LFM 40B MoE"
  },
  "lfm-40b": {
    "prompt": 1.5e-7,
    "completion": 1.5e-7
  },
  "anthracite-org/magnum-v2-72b": {
    "prompt": 0.000003,
    "completion": 0.000003,
    "name": "Magnum v2 72B"
  },
  "magnum-v2-72b": {
    "prompt": 0.000003,
    "completion": 0.000003
  },
  "meta-llama/llama-3.2-11b-vision-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Meta: Llama 3.2 11B Vision Instruct (free)"
  },
  "llama-3.2-11b-vision-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "meta-llama/llama-3.2-11b-vision-instruct": {
    "prompt": 4.9e-8,
    "completion": 4.9e-8,
    "name": "Meta: Llama 3.2 11B Vision Instruct"
  },
  "llama-3.2-11b-vision-instruct": {
    "prompt": 4.9e-8,
    "completion": 4.9e-8
  },
  "meta-llama/llama-3.2-90b-vision-instruct": {
    "prompt": 0.0000012,
    "completion": 0.0000012,
    "name": "Meta: Llama 3.2 90B Vision Instruct"
  },
  "llama-3.2-90b-vision-instruct": {
    "prompt": 0.0000012,
    "completion": 0.0000012
  },
  "meta-llama/llama-3.2-1b-instruct": {
    "prompt": 5e-9,
    "completion": 1e-8,
    "name": "Meta: Llama 3.2 1B Instruct"
  },
  "llama-3.2-1b-instruct": {
    "prompt": 5e-9,
    "completion": 1e-8
  },
  "meta-llama/llama-3.2-3b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Meta: Llama 3.2 3B Instruct (free)"
  },
  "llama-3.2-3b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "meta-llama/llama-3.2-3b-instruct": {
    "prompt": 3e-9,
    "completion": 6e-9,
    "name": "Meta: Llama 3.2 3B Instruct"
  },
  "llama-3.2-3b-instruct": {
    "prompt": 3e-9,
    "completion": 6e-9
  },
  "qwen/qwen-2.5-72b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Qwen2.5 72B Instruct (free)"
  },
  "qwen-2.5-72b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "qwen/qwen-2.5-72b-instruct": {
    "prompt": 1.01e-7,
    "completion": 1.01e-7,
    "name": "Qwen2.5 72B Instruct"
  },
  "qwen-2.5-72b-instruct": {
    "prompt": 1.01e-7,
    "completion": 1.01e-7
  },
  "neversleep/llama-3.1-lumimaid-8b": {
    "prompt": 1.8e-7,
    "completion": 0.000001,
    "name": "NeverSleep: Lumimaid v0.2 8B"
  },
  "llama-3.1-lumimaid-8b": {
    "prompt": 1.8e-7,
    "completion": 0.000001
  },
  "openai/o1-mini": {
    "prompt": 0.0000011,
    "completion": 0.0000044,
    "name": "OpenAI: o1-mini"
  },
  "o1-mini": {
    "prompt": 0.0000011,
    "completion": 0.0000044
  },
  "openai/o1-preview-2024-09-12": {
    "prompt": 0.000015,
    "completion": 0.00006,
    "name": "OpenAI: o1-preview (2024-09-12)"
  },
  "o1-preview-2024-09-12": {
    "prompt": 0.000015,
    "completion": 0.00006
  },
  "openai/o1-mini-2024-09-12": {
    "prompt": 0.0000011,
    "completion": 0.0000044,
    "name": "OpenAI: o1-mini (2024-09-12)"
  },
  "o1-mini-2024-09-12": {
    "prompt": 0.0000011,
    "completion": 0.0000044
  },
  "openai/o1-preview": {
    "prompt": 0.000015,
    "completion": 0.00006,
    "name": "OpenAI: o1-preview"
  },
  "o1-preview": {
    "prompt": 0.000015,
    "completion": 0.00006
  },
  "mistralai/pixtral-12b": {
    "prompt": 1e-7,
    "completion": 1e-7,
    "name": "Mistral: Pixtral 12B"
  },
  "pixtral-12b": {
    "prompt": 1e-7,
    "completion": 1e-7
  },
  "cohere/command-r-08-2024": {
    "prompt": 1.5e-7,
    "completion": 6e-7,
    "name": "Cohere: Command R (08-2024)"
  },
  "command-r-08-2024": {
    "prompt": 1.5e-7,
    "completion": 6e-7
  },
  "cohere/command-r-plus-08-2024": {
    "prompt": 0.0000025,
    "completion": 0.00001,
    "name": "Cohere: Command R+ (08-2024)"
  },
  "command-r-plus-08-2024": {
    "prompt": 0.0000025,
    "completion": 0.00001
  },
  "qwen/qwen-2.5-vl-7b-instruct": {
    "prompt": 2e-7,
    "completion": 2e-7,
    "name": "Qwen: Qwen2.5-VL 7B Instruct"
  },
  "qwen-2.5-vl-7b-instruct": {
    "prompt": 2e-7,
    "completion": 2e-7
  },
  "sao10k/l3.1-euryale-70b": {
    "prompt": 6.5e-7,
    "completion": 7.5e-7,
    "name": "Sao10K: Llama 3.1 Euryale 70B v2.2"
  },
  "l3.1-euryale-70b": {
    "prompt": 6.5e-7,
    "completion": 7.5e-7
  },
  "microsoft/phi-3.5-mini-128k-instruct": {
    "prompt": 1e-7,
    "completion": 1e-7,
    "name": "Microsoft: Phi-3.5 Mini 128K Instruct"
  },
  "phi-3.5-mini-128k-instruct": {
    "prompt": 1e-7,
    "completion": 1e-7
  },
  "nousresearch/hermes-3-llama-3.1-70b": {
    "prompt": 1e-7,
    "completion": 2.8e-7,
    "name": "Nous: Hermes 3 70B Instruct"
  },
  "hermes-3-llama-3.1-70b": {
    "prompt": 1e-7,
    "completion": 2.8e-7
  },
  "nousresearch/hermes-3-llama-3.1-405b": {
    "prompt": 7e-7,
    "completion": 8e-7,
    "name": "Nous: Hermes 3 405B Instruct"
  },
  "hermes-3-llama-3.1-405b": {
    "prompt": 7e-7,
    "completion": 8e-7
  },
  "openai/chatgpt-4o-latest": {
    "prompt": 0.000005,
    "completion": 0.000015,
    "name": "OpenAI: ChatGPT-4o"
  },
  "chatgpt-4o-latest": {
    "prompt": 0.000005,
    "completion": 0.000015
  },
  "sao10k/l3-lunaris-8b": {
    "prompt": 2e-8,
    "completion": 5e-8,
    "name": "Sao10K: Llama 3 8B Lunaris"
  },
  "l3-lunaris-8b": {
    "prompt": 2e-8,
    "completion": 5e-8
  },
  "aetherwiing/mn-starcannon-12b": {
    "prompt": 8e-7,
    "completion": 0.0000012,
    "name": "Aetherwiing: Starcannon 12B"
  },
  "mn-starcannon-12b": {
    "prompt": 8e-7,
    "completion": 0.0000012
  },
  "openai/gpt-4o-2024-08-06": {
    "prompt": 0.0000025,
    "completion": 0.00001,
    "name": "OpenAI: GPT-4o (2024-08-06)"
  },
  "gpt-4o-2024-08-06": {
    "prompt": 0.0000025,
    "completion": 0.00001
  },
  "nothingiisreal/mn-celeste-12b": {
    "prompt": 8e-7,
    "completion": 0.0000012,
    "name": "Mistral Nemo 12B Celeste"
  },
  "mn-celeste-12b": {
    "prompt": 8e-7,
    "completion": 0.0000012
  },
  "meta-llama/llama-3.1-405b": {
    "prompt": 0.000002,
    "completion": 0.000002,
    "name": "Meta: Llama 3.1 405B (base)"
  },
  "llama-3.1-405b": {
    "prompt": 0.000002,
    "completion": 0.000002
  },
  "meta-llama/llama-3.1-70b-instruct": {
    "prompt": 1e-7,
    "completion": 2.8e-7,
    "name": "Meta: Llama 3.1 70B Instruct"
  },
  "llama-3.1-70b-instruct": {
    "prompt": 1e-7,
    "completion": 2.8e-7
  },
  "meta-llama/llama-3.1-405b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Meta: Llama 3.1 405B Instruct (free)"
  },
  "llama-3.1-405b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "meta-llama/llama-3.1-405b-instruct": {
    "prompt": 8e-7,
    "completion": 8e-7,
    "name": "Meta: Llama 3.1 405B Instruct"
  },
  "llama-3.1-405b-instruct": {
    "prompt": 8e-7,
    "completion": 8e-7
  },
  "meta-llama/llama-3.1-8b-instruct": {
    "prompt": 1.5e-8,
    "completion": 2e-8,
    "name": "Meta: Llama 3.1 8B Instruct"
  },
  "llama-3.1-8b-instruct": {
    "prompt": 1.5e-8,
    "completion": 2e-8
  },
  "mistralai/mistral-nemo:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Mistral: Mistral Nemo (free)"
  },
  "mistral-nemo:free": {
    "prompt": 0,
    "completion": 0
  },
  "mistralai/mistral-nemo": {
    "prompt": 7.5e-9,
    "completion": 5e-8,
    "name": "Mistral: Mistral Nemo"
  },
  "mistral-nemo": {
    "prompt": 7.5e-9,
    "completion": 5e-8
  },
  "openai/gpt-4o-mini-2024-07-18": {
    "prompt": 1.5e-7,
    "completion": 6e-7,
    "name": "OpenAI: GPT-4o-mini (2024-07-18)"
  },
  "gpt-4o-mini-2024-07-18": {
    "prompt": 1.5e-7,
    "completion": 6e-7
  },
  "openai/gpt-4o-mini": {
    "prompt": 1.5e-7,
    "completion": 6e-7,
    "name": "OpenAI: GPT-4o-mini"
  },
  "gpt-4o-mini": {
    "prompt": 1.5e-7,
    "completion": 6e-7
  },
  "google/gemma-2-27b-it": {
    "prompt": 8e-7,
    "completion": 8e-7,
    "name": "Google: Gemma 2 27B"
  },
  "gemma-2-27b-it": {
    "prompt": 8e-7,
    "completion": 8e-7
  },
  "alpindale/magnum-72b": {
    "prompt": 0.000004,
    "completion": 0.000006,
    "name": "Magnum 72B"
  },
  "magnum-72b": {
    "prompt": 0.000004,
    "completion": 0.000006
  },
  "google/gemma-2-9b-it:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Google: Gemma 2 9B (free)"
  },
  "gemma-2-9b-it:free": {
    "prompt": 0,
    "completion": 0
  },
  "google/gemma-2-9b-it": {
    "prompt": 4e-9,
    "completion": 4e-9,
    "name": "Google: Gemma 2 9B"
  },
  "gemma-2-9b-it": {
    "prompt": 4e-9,
    "completion": 4e-9
  },
  "01-ai/yi-large": {
    "prompt": 0.000003,
    "completion": 0.000003,
    "name": "01.AI: Yi Large"
  },
  "yi-large": {
    "prompt": 0.000003,
    "completion": 0.000003
  },
  "anthropic/claude-3.5-sonnet-20240620:beta": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude 3.5 Sonnet (2024-06-20) (self-moderated)"
  },
  "claude-3.5-sonnet-20240620:beta": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "anthropic/claude-3.5-sonnet-20240620": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude 3.5 Sonnet (2024-06-20)"
  },
  "claude-3.5-sonnet-20240620": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "sao10k/l3-euryale-70b": {
    "prompt": 0.00000148,
    "completion": 0.00000148,
    "name": "Sao10k: Llama 3 Euryale 70B v2.1"
  },
  "l3-euryale-70b": {
    "prompt": 0.00000148,
    "completion": 0.00000148
  },
  "cognitivecomputations/dolphin-mixtral-8x22b": {
    "prompt": 9e-7,
    "completion": 9e-7,
    "name": "Dolphin 2.9.2 Mixtral 8x22B 🐬"
  },
  "dolphin-mixtral-8x22b": {
    "prompt": 9e-7,
    "completion": 9e-7
  },
  "qwen/qwen-2-72b-instruct": {
    "prompt": 9e-7,
    "completion": 9e-7,
    "name": "Qwen 2 72B Instruct"
  },
  "qwen-2-72b-instruct": {
    "prompt": 9e-7,
    "completion": 9e-7
  },
  "mistralai/mistral-7b-instruct-v0.3": {
    "prompt": 2.8e-8,
    "completion": 5.4e-8,
    "name": "Mistral: Mistral 7B Instruct v0.3"
  },
  "mistral-7b-instruct-v0.3": {
    "prompt": 2.8e-8,
    "completion": 5.4e-8
  },
  "nousresearch/hermes-2-pro-llama-3-8b": {
    "prompt": 2.5e-8,
    "completion": 4e-8,
    "name": "NousResearch: Hermes 2 Pro - Llama-3 8B"
  },
  "hermes-2-pro-llama-3-8b": {
    "prompt": 2.5e-8,
    "completion": 4e-8
  },
  "mistralai/mistral-7b-instruct:free": {
    "prompt": 0,
    "completion": 0,
    "name": "Mistral: Mistral 7B Instruct (free)"
  },
  "mistral-7b-instruct:free": {
    "prompt": 0,
    "completion": 0
  },
  "mistralai/mistral-7b-instruct": {
    "prompt": 2.8e-8,
    "completion": 5.4e-8,
    "name": "Mistral: Mistral 7B Instruct"
  },
  "mistral-7b-instruct": {
    "prompt": 2.8e-8,
    "completion": 5.4e-8
  },
  "microsoft/phi-3-mini-128k-instruct": {
    "prompt": 1e-7,
    "completion": 1e-7,
    "name": "Microsoft: Phi-3 Mini 128K Instruct"
  },
  "phi-3-mini-128k-instruct": {
    "prompt": 1e-7,
    "completion": 1e-7
  },
  "microsoft/phi-3-medium-128k-instruct": {
    "prompt": 0.000001,
    "completion": 0.000001,
    "name": "Microsoft: Phi-3 Medium 128K Instruct"
  },
  "phi-3-medium-128k-instruct": {
    "prompt": 0.000001,
    "completion": 0.000001
  },
  "neversleep/llama-3-lumimaid-70b": {
    "prompt": 0.000004,
    "completion": 0.000006,
    "name": "NeverSleep: Llama 3 Lumimaid 70B"
  },
  "llama-3-lumimaid-70b": {
    "prompt": 0.000004,
    "completion": 0.000006
  },
  "google/gemini-flash-1.5": {
    "prompt": 7.5e-8,
    "completion": 3e-7,
    "name": "Google: Gemini 1.5 Flash"
  },
  "gemini-flash-1.5": {
    "prompt": 7.5e-8,
    "completion": 3e-7
  },
  "openai/gpt-4o-2024-05-13": {
    "prompt": 0.000005,
    "completion": 0.000015,
    "name": "OpenAI: GPT-4o (2024-05-13)"
  },
  "gpt-4o-2024-05-13": {
    "prompt": 0.000005,
    "completion": 0.000015
  },
  "openai/gpt-4o": {
    "prompt": 0.0000025,
    "completion": 0.00001,
    "name": "OpenAI: GPT-4o"
  },
  "gpt-4o": {
    "prompt": 0.0000025,
    "completion": 0.00001
  },
  "openai/gpt-4o:extended": {
    "prompt": 0.000006,
    "completion": 0.000018,
    "name": "OpenAI: GPT-4o (extended)"
  },
  "gpt-4o:extended": {
    "prompt": 0.000006,
    "completion": 0.000018
  },
  "meta-llama/llama-guard-2-8b": {
    "prompt": 2e-7,
    "completion": 2e-7,
    "name": "Meta: LlamaGuard 2 8B"
  },
  "llama-guard-2-8b": {
    "prompt": 2e-7,
    "completion": 2e-7
  },
  "sao10k/fimbulvetr-11b-v2": {
    "prompt": 8e-7,
    "completion": 0.0000012,
    "name": "Fimbulvetr 11B v2"
  },
  "fimbulvetr-11b-v2": {
    "prompt": 8e-7,
    "completion": 0.0000012
  },
  "meta-llama/llama-3-70b-instruct": {
    "prompt": 3e-7,
    "completion": 4e-7,
    "name": "Meta: Llama 3 70B Instruct"
  },
  "llama-3-70b-instruct": {
    "prompt": 3e-7,
    "completion": 4e-7
  },
  "meta-llama/llama-3-8b-instruct": {
    "prompt": 3e-8,
    "completion": 6e-8,
    "name": "Meta: Llama 3 8B Instruct"
  },
  "llama-3-8b-instruct": {
    "prompt": 3e-8,
    "completion": 6e-8
  },
  "mistralai/mixtral-8x22b-instruct": {
    "prompt": 9e-7,
    "completion": 9e-7,
    "name": "Mistral: Mixtral 8x22B Instruct"
  },
  "mixtral-8x22b-instruct": {
    "prompt": 9e-7,
    "completion": 9e-7
  },
  "microsoft/wizardlm-2-8x22b": {
    "prompt": 4.8e-7,
    "completion": 4.8e-7,
    "name": "WizardLM-2 8x22B"
  },
  "wizardlm-2-8x22b": {
    "prompt": 4.8e-7,
    "completion": 4.8e-7
  },
  "openai/gpt-4-turbo": {
    "prompt": 0.00001,
    "completion": 0.00003,
    "name": "OpenAI: GPT-4 Turbo"
  },
  "gpt-4-turbo": {
    "prompt": 0.00001,
    "completion": 0.00003
  },
  "google/gemini-pro-1.5": {
    "prompt": 0.00000125,
    "completion": 0.000005,
    "name": "Google: Gemini 1.5 Pro"
  },
  "gemini-pro-1.5": {
    "prompt": 0.00000125,
    "completion": 0.000005
  },
  "gemini-pro": {
    "prompt": 0.00000125,
    "completion": 0.000005
  },
  "cohere/command-r-plus": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Cohere: Command R+"
  },
  "command-r-plus": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "cohere/command-r-plus-04-2024": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Cohere: Command R+ (04-2024)"
  },
  "command-r-plus-04-2024": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "sophosympatheia/midnight-rose-70b": {
    "prompt": 8e-7,
    "completion": 8e-7,
    "name": "Midnight Rose 70B"
  },
  "midnight-rose-70b": {
    "prompt": 8e-7,
    "completion": 8e-7
  },
  "cohere/command": {
    "prompt": 0.000001,
    "completion": 0.000002,
    "name": "Cohere: Command"
  },
  "command": {
    "prompt": 0.000001,
    "completion": 0.000002
  },
  "cohere/command-r": {
    "prompt": 5e-7,
    "completion": 0.0000015,
    "name": "Cohere: Command R"
  },
  "command-r": {
    "prompt": 5e-7,
    "completion": 0.0000015
  },
  "anthropic/claude-3-haiku:beta": {
    "prompt": 2.5e-7,
    "completion": 0.00000125,
    "name": "Anthropic: Claude 3 Haiku (self-moderated)"
  },
  "claude-3-haiku:beta": {
    "prompt": 2.5e-7,
    "completion": 0.00000125
  },
  "anthropic/claude-3-haiku": {
    "prompt": 2.5e-7,
    "completion": 0.00000125,
    "name": "Anthropic: Claude 3 Haiku"
  },
  "claude-3-haiku": {
    "prompt": 2.5e-7,
    "completion": 0.00000125
  },
  "anthropic/claude-3-opus:beta": {
    "prompt": 0.000015,
    "completion": 0.000075,
    "name": "Anthropic: Claude 3 Opus (self-moderated)"
  },
  "claude-3-opus:beta": {
    "prompt": 0.000015,
    "completion": 0.000075
  },
  "anthropic/claude-3-opus": {
    "prompt": 0.000015,
    "completion": 0.000075,
    "name": "Anthropic: Claude 3 Opus"
  },
  "anthropic/claude-3-sonnet": {
    "prompt": 0.000003,
    "completion": 0.000015,
    "name": "Anthropic: Claude 3 Sonnet"
  },
  "claude-3-sonnet": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "claude-3-sonnet-20240229": {
    "prompt": 0.000003,
    "completion": 0.000015
  },
  "cohere/command-r-03-2024": {
    "prompt": 5e-7,
    "completion": 0.0000015,
    "name": "Cohere: Command R (03-2024)"
  },
  "command-r-03-2024": {
    "prompt": 5e-7,
    "completion": 0.0000015
  },
  "mistralai/mistral-large": {
    "prompt": 0.000002,
    "completion": 0.000006,
    "name": "Mistral Large"
  },
  "mistral-large": {
    "prompt": 0.000002,
    "completion": 0.000006
  },
  "openai/gpt-3.5-turbo-0613": {
    "prompt": 0.000001,
    "completion": 0.000002,
    "name": "OpenAI: GPT-3.5 Turbo (older v0613)"
  },
  "gpt-3.5-turbo-0613": {
    "prompt": 0.000001,
    "completion": 0.000002
  },
  "gpt-3.5-turbo": {
    "prompt": 5e-7,
    "completion": 0.0000015
  },
  "openai/gpt-4-turbo-preview": {
    "prompt": 0.00001,
    "completion": 0.00003,
    "name": "OpenAI: GPT-4 Turbo Preview"
  },
  "gpt-4-turbo-preview": {
    "prompt": 0.00001,
    "completion": 0.00003
  },
  "nousresearch/nous-hermes-2-mixtral-8x7b-dpo": {
    "prompt": 6e-7,
    "completion": 6e-7,
    "name": "Nous: Hermes 2 Mixtral 8x7B DPO"
  },
  "nous-hermes-2-mixtral-8x7b-dpo": {
    "prompt": 6e-7,
    "completion": 6e-7
  },
  "mistralai/mistral-tiny": {
    "prompt": 2.5e-7,
    "completion": 2.5e-7,
    "name": "Mistral Tiny"
  },
  "mistral-tiny": {
    "prompt": 2.5e-7,
    "completion": 2.5e-7
  },
  "mistralai/mistral-small": {
    "prompt": 2e-7,
    "completion": 6e-7,
    "name": "Mistral Small"
  },
  "mistral-small": {
    "prompt": 2e-7,
    "completion": 6e-7
  },
  "mistralai/mistral-7b-instruct-v0.2": {
    "prompt": 2e-7,
    "completion": 2e-7,
    "name": "Mistral: Mistral 7B Instruct v0.2"
  },
  "mistral-7b-instruct-v0.2": {
    "prompt": 2e-7,
    "completion": 2e-7
  },
  "mistralai/mixtral-8x7b-instruct": {
    "prompt": 8e-8,
    "completion": 2.4e-7,
    "name": "Mistral: Mixtral 8x7B Instruct"
  },
  "mixtral-8x7b-instruct": {
    "prompt": 8e-8,
    "completion": 2.4e-7
  },
  "neversleep/noromaid-20b": {
    "prompt": 0.00000125,
    "completion": 0.000002,
    "name": "Noromaid 20B"
  },
  "noromaid-20b": {
    "prompt": 0.00000125,
    "completion": 0.000002
  },
  "alpindale/goliath-120b": {
    "prompt": 0.000009,
    "completion": 0.000011,
    "name": "Goliath 120B"
  },
  "goliath-120b": {
    "prompt": 0.000009,
    "completion": 0.000011
  },
  "undi95/toppy-m-7b": {
    "prompt": 8e-7,
    "completion": 0.0000012,
    "name": "Toppy M 7B"
  },
  "toppy-m-7b": {
    "prompt": 8e-7,
    "completion": 0.0000012
  },
  "openrouter/auto": {
    "prompt": -1,
    "completion": -1,
    "name": "Auto Router"
  },
  "auto": {
    "prompt": -1,
    "completion": -1
  },
  "openai/gpt-4-1106-preview": {
    "prompt": 0.00001,
    "completion": 0.00003,
    "name": "OpenAI: GPT-4 Turbo (older v1106)"
  },
  "gpt-4-1106-preview": {
    "prompt": 0.00001,
    "completion": 0.00003
  },
  "mistralai/mistral-7b-instruct-v0.1": {
    "prompt": 1.1e-7,
    "completion": 1.9e-7,
    "name": "Mistral: Mistral 7B Instruct v0.1"
  },
  "mistral-7b-instruct-v0.1": {
    "prompt": 1.1e-7,
    "completion": 1.9e-7
  },
  "openai/gpt-3.5-turbo-instruct": {
    "prompt": 0.0000015,
    "completion": 0.000002,
    "name": "OpenAI: GPT-3.5 Turbo Instruct"
  },
  "gpt-3.5-turbo-instruct": {
    "prompt": 0.0000015,
    "completion": 0.000002
  },
  "pygmalionai/mythalion-13b": {
    "prompt": 8e-7,
    "completion": 0.0000012,
    "name": "Pygmalion: Mythalion 13B"
  },
  "mythalion-13b": {
    "prompt": 8e-7,
    "completion": 0.0000012
  },
  "openai/gpt-3.5-turbo-16k": {
    "prompt": 0.000003,
    "completion": 0.000004,
    "name": "OpenAI: GPT-3.5 Turbo 16k"
  },
  "gpt-3.5-turbo-16k": {
    "prompt": 0.000003,
    "completion": 0.000004
  },
  "mancer/weaver": {
    "prompt": 0.0000015,
    "completion": 0.0000015,
    "name": "Mancer: Weaver (alpha)"
  },
  "weaver": {
    "prompt": 0.0000015,
    "completion": 0.0000015
  },
  "undi95/remm-slerp-l2-13b": {
    "prompt": 7e-7,
    "completion": 0.000001,
    "name": "ReMM SLERP 13B"
  },
  "remm-slerp-l2-13b": {
    "prompt": 7e-7,
    "completion": 0.000001
  },
  "gryphe/mythomax-l2-13b": {
    "prompt": 6e-8,
    "completion": 6e-8,
    "name": "MythoMax 13B"
  },
  "mythomax-l2-13b": {
    "prompt": 6e-8,
    "completion": 6e-8
  },
  "openai/gpt-4-0314": {
    "prompt": 0.00003,
    "completion": 0.00006,
    "name": "OpenAI: GPT-4 (older v0314)"
  },
  "gpt-4-0314": {
    "prompt": 0.00003,
    "completion": 0.00006
  },
  "openai/gpt-4": {
    "prompt": 0.00003,
    "completion": 0.00006,
    "name": "OpenAI: GPT-4"
  },
  "openai/gpt-3.5-turbo": {
    "prompt": 5e-7,
    "completion": 0.0000015,
    "name": "OpenAI: GPT-3.5 Turbo"
  }
};

export function calculateCost(model: string, tokens: number, promptTokens?: number, completionTokens?: number): number {
  // Try exact match first
  let rateInfo: ModelPricing | null = MODEL_PRICING[model] || null
  
  if (!rateInfo) {
    // Try partial matches for model variants
    const modelKey = Object.keys(MODEL_PRICING).find(key => 
      model.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(model.toLowerCase())
    )
    rateInfo = modelKey ? MODEL_PRICING[modelKey] : null
  }
  
  // If we have separate prompt and completion tokens, use them for more accurate pricing
  if (rateInfo && promptTokens && completionTokens) {
    return (promptTokens * rateInfo.prompt) + (completionTokens * rateInfo.completion)
  }
  
  // Otherwise use prompt rate for total tokens
  if (rateInfo) {
    return tokens * rateInfo.prompt
  }
  
  // Fallback to a default rate if model not found (roughly GPT-3.5 pricing)
  return tokens * 0.000001
}

export function getModelInfo(model: string): ModelPricing | null {
  // Try exact match first
  let rateInfo: ModelPricing | undefined = MODEL_PRICING[model]
  
  if (!rateInfo) {
    // Try partial matches
    const modelKey = Object.keys(MODEL_PRICING).find(key => 
      model.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(model.toLowerCase())
    )
    rateInfo = modelKey ? MODEL_PRICING[modelKey] : undefined
  }
  
  return rateInfo || null
}

export function listAvailableModels(): string[] {
  return Object.keys(MODEL_PRICING).filter(key => MODEL_PRICING[key].name)
}
