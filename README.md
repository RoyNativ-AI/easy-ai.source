<p align="center">
  <img src="https://img.shields.io/npm/v/@easyai/cli?color=blue&label=npm" alt="npm version" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</p>

<h1 align="center">EasyAI</h1>

<p align="center">
  <strong>AI observability in 60 seconds, not 60 minutes.</strong>
</p>

<p align="center">
  Simple, zero-config logging for your AI API calls.<br/>
  Track costs. Monitor usage. Debug issues. No infrastructure required.
</p>

---

## The Problem

You're building with AI APIs. You need to know:
- How much am I spending?
- Which prompts are slow?
- Why did that request fail?

**Enterprise solutions** require Docker, Postgres, Redis, and an hour of setup.

**EasyAI** requires one command.

## Quick Start

```bash
npm install -g @easyai/cli
easyai init
easyai ui
```

That's it. Open `http://localhost:7542` and see your dashboard.

## Auto-Capture (One Line of Code)

Add one import and all your AI calls are automatically logged:

<table>
<tr>
<td>

**Python**
```python
import easyai  # Just add this

from openai import OpenAI
client = OpenAI()
# All calls automatically logged
```

</td>
<td>

**Node.js**
```javascript
require('easyai');  // Just add this

const OpenAI = require('openai');
const client = new OpenAI();
// All calls automatically logged
```

</td>
</tr>
</table>

## Dashboard

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=EasyAI+Dashboard" alt="EasyAI Dashboard" />
</p>

- **Analytics** - Cost breakdown, token usage, request counts
- **Logs** - Every request and response, searchable
- **Playground** - Test prompts across multiple models
- **Prompts** - Save and organize your prompt templates

## Why EasyAI?

| | EasyAI | Enterprise Solutions |
|---|--------|---------------------|
| **Setup** | `npm install && easyai init` | Docker + Postgres + Redis + Config |
| **Time** | 60 seconds | 60+ minutes |
| **Integration** | One import line | SDK wrappers, decorators |
| **Infrastructure** | None (local files) | Database, cache, queue |
| **Cost** | Free | Free tier limits, then $$ |

## Supported Providers

| Provider | Models |
|----------|--------|
| **OpenAI** | GPT-4o, GPT-4, GPT-3.5, o1, o1-mini |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, Haiku |
| **Google** | Gemini Pro, Gemini Flash |
| **OpenRouter** | 300+ models |
| **Ollama** | Any local model |

## CLI Commands

```bash
easyai init              # Initialize in your project
easyai ui                # Open the dashboard
easyai logs              # View recent API calls
easyai models            # List available models
easyai playground        # Test prompts interactively
easyai analytics         # View usage statistics
easyai config --list     # View configuration
```

## Features

### Cost Tracking
See exactly how much each request costs with accurate per-token pricing for 300+ models.

### Request Logging
Full request and response bodies, headers, timing, and error details - all stored locally.

### Multi-Model Testing
Test the same prompt across GPT-4, Claude, and Gemini simultaneously in the playground.

### Prompt Management
Save, organize, and version your prompts with markdown templates and variables.

### Zero Cloud
Everything runs on your machine. No data leaves your computer. No accounts required.

## Configuration

API keys are stored in `easyai/config/easyai.env`:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

## Project Structure

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

## Philosophy

1. **Simple > Feature-rich** - Do one thing well
2. **Local > Cloud** - Your data stays yours
3. **Zero config > Flexible config** - Works out of the box
4. **One command > Documentation** - If it needs docs, it's too complex

## Comparison

| Feature | EasyAI | Langfuse | Helicone |
|---------|--------|----------|----------|
| Setup time | 1 min | 30+ min | 10 min |
| Self-hosted | Local files | Docker stack | Cloud only |
| Pricing | Free | Free tier | Free tier |
| Best for | Solo devs, POCs | Teams | Production |

**EasyAI is for hackers. Enterprise solutions are for enterprises.**

## Contributing

PRs welcome! This is open source software.

```bash
git clone https://github.com/RoyNativ-AI/easy-ai.source
cd easy-ai.source/cli-source
npm install
npm run dev
```

## License

MIT License - Use it however you want.

---

<p align="center">
  <strong>Stop configuring. Start building.</strong>
</p>

<p align="center">
  <a href="https://github.com/RoyNativ-AI/easy-ai.source">GitHub</a> |
  <a href="https://www.npmjs.com/package/@easyai/cli">npm</a>
</p>
