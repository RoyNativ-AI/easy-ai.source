import OpenAI from 'openai';
import { calculateCost } from '../utils/pricing';

interface APIResponse {
  content: string;
  tokens: number;
  cost: number;
}

export async function callOpenAI(
  apiKey: string,
  model: string,
  prompt: string
): Promise<APIResponse> {
  if (!apiKey || apiKey === 'your_openai_key_here') {
    throw new Error('OpenAI API key not configured. Set it in easyai/config/easyai.env');
  }

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const response = completion.choices[0]?.message?.content || '';
    const usage = completion.usage;

    const inputTokens = usage?.prompt_tokens || 0;
    const outputTokens = usage?.completion_tokens || 0;
    const totalTokens = usage?.total_tokens || 0;

    // Calculate cost using central pricing
    const cost = calculateCost(model, totalTokens, inputTokens, outputTokens);

    return {
      content: response,
      tokens: totalTokens,
      cost: parseFloat(cost.toFixed(6))
    };

  } catch (error: any) {
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Check your billing.');
    } else if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key.');
    } else {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}