<h1 align="center">EasyAI</h1>

<h4 align="center">AI observability in 60 seconds, not 60 minutes.</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/@easyai/cli">
    <img src="https://img.shields.io/npm/v/@easyai/cli?color=blue&label=npm" alt="npm version">
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/node-18+-green.svg" alt="Node 18+">
  </a>
  <a href="https://github.com/RoyNativ-AI/easy-ai.source/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/RoyNativ-AI/easy-ai.source" alt="License">
  </a>
  <a href="https://github.com/RoyNativ-AI/easy-ai.source/stargazers">
    <img src="https://img.shields.io/github/stars/RoyNativ-AI/easy-ai.source?style=social" alt="Stars">
  </a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-why-easyai">Why EasyAI</a> •
  <a href="#-configuration">Configuration</a> •
  <a href="#-providers">Providers</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## Quick Start

```bash
# Install
npm install -g @easyai/cli

# Initialize in your project
cd your-project && easyai init

# Open dashboard
easyai ui
```

**That's it.** Dashboard at `http://localhost:7542`

---

## Why EasyAI?

| Problem | How We Solve It |
|---------|-----------------|
| **Complex setup** | One command: `easyai init` - no Docker, no database |
| **SDK boilerplate** | One import line: `import easyai` - zero code changes |
| **Hidden costs** | Real-time cost tracking for 300+ models |
| **Debugging blind** | Full request/response logs, searchable |
| **Vendor lock-in** | Switch between OpenAI, Claude, Gemini instantly |
| **Data privacy** | Everything local - no cloud, no accounts |

---

## Features

```
Zero Config         npm install + easyai init, done
Auto-Capture        One import line logs all AI calls
Cost Tracking       Per-token pricing for 300+ models
Local Dashboard     Analytics, logs, playground at localhost
Multi-Provider      OpenAI, Anthropic, Google, OpenRouter, Ollama
Prompt Library      Save, organize, version your prompts
Privacy First       All data stays on your machine
```

---

## Auto-Capture

Add one line to your code. All AI calls automatically logged.

### Python

```python
import easyai  # Add this line

from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)
# Automatically logged with cost, tokens, timing
```

### Node.js

```javascript
require('easyai');  // Add this line

const OpenAI = require('openai');
const client = new OpenAI();
const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "Hello" }]
});
// Automatically logged with cost, tokens, timing
```

---

## CLI Commands

```bash
easyai init              # Initialize in your project
easyai ui                # Open dashboard (port 7542)
easyai ui --port 8080    # Custom port
easyai logs              # View recent API calls
easyai models            # List available models
easyai playground        # Test prompts interactively
easyai analytics         # View usage statistics
easyai config --list     # View configuration
```

---

## Configuration

API keys stored in `easyai/config/easyai.env`:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
OPENROUTER_API_KEY=sk-or-...
OLLAMA_BASE_URL=http://localhost:11434
```

<details>
<summary><strong>View project structure</strong></summary>

```
your-project/
  easyai/
    config/
      easyai.env         # Your API keys
      settings.json      # Dashboard settings
    logs/
      calls.jsonl        # API call history
    prompts/
      examples/          # Prompt templates
```

</details>

---

## Providers

| Provider | Models | Status |
|----------|--------|--------|
| **OpenAI** | GPT-4o, GPT-4, GPT-3.5, o1, o1-mini | Supported |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, Haiku | Supported |
| **Google** | Gemini Pro, Gemini Flash | Supported |
| **OpenRouter** | 300+ models | Supported |
| **Ollama** | Any local model | Supported |

---

## Dashboard

The dashboard provides:

| Tab | Description |
|-----|-------------|
| **Analytics** | Cost breakdown, token usage, request counts |
| **Logs** | Full request/response history, searchable |
| **Playground** | Test prompts across multiple models |
| **Prompts** | Save and organize prompt templates |
| **Settings** | Configure API keys and preferences |

---

## Comparison

| Feature | EasyAI | Langfuse | Helicone |
|---------|--------|----------|----------|
| Setup time | 1 min | 30+ min | 10 min |
| Infrastructure | None (local) | Docker + DB | Cloud only |
| Integration | 1 import line | SDK decorators | Proxy setup |
| Pricing | Free | Free tier | Free tier |
| Best for | Solo devs, POCs | Teams | Production |

**EasyAI is for hackers. Enterprise solutions are for enterprises.**

---

## Use Cases

| Use Case | Description |
|----------|-------------|
| **Cost Monitoring** | Track spending before the bill surprises you |
| **Debugging** | See exactly what went to the API and back |
| **Model Testing** | Compare GPT-4 vs Claude vs Gemini on same prompt |
| **Prompt Iteration** | Save versions, test changes, track results |
| **Learning** | Understand how AI APIs actually work |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Dashboard not opening | Check port: `easyai ui --port 7543` |
| No logs appearing | Ensure `import easyai` is at top of file |
| API key not working | Check `easyai/config/easyai.env` format |
| Port already in use | Kill process: `lsof -ti:7542 \| xargs kill` |

---

## Requirements

- Node.js 18+
- npm or yarn

```bash
npm install -g @easyai/cli
```

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## AI Prompt

Copy this to quickly set up with AI assistants:

```
I need to monitor my AI API calls. Use EasyAI from github.com/RoyNativ-AI/easy-ai.source

Setup:
npm install -g @easyai/cli
cd my-project && easyai init
Add "import easyai" to top of my Python files (or require('easyai') for Node.js)
easyai ui to see dashboard

I want to track: [COSTS / LOGS / BOTH]
My providers: [OPENAI / ANTHROPIC / BOTH]
```

---

<p align="center">
  <sub>Built by <a href="https://github.com/RoyNativ-AI">Roy Nativ</a> at <a href="https://officely.ai">Officely AI</a></sub>
</p>

<p align="center">
  <a href="https://github.com/RoyNativ-AI/easy-ai.source/issues">Report Bug</a> •
  <a href="https://github.com/RoyNativ-AI/easy-ai.source/issues">Request Feature</a>
</p>
