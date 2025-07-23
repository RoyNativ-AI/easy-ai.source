#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Updates pricing data from OpenRouter CSV export
 * Usage: node scripts/update-pricing.js path/to/openrouter_pricing.csv
 */

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function updatePricingFromCsv(csvPath) {
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  console.log(`📊 Reading pricing data from: ${csvPath}`);
  
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    console.error('❌ CSV file is empty');
    process.exit(1);
  }

  // Parse header
  const headers = parseCsvLine(lines[0]);
  const idIndex = headers.indexOf('id');
  const nameIndex = headers.indexOf('name');
  const promptPriceIndex = headers.indexOf('pricing_prompt');
  const completionPriceIndex = headers.indexOf('pricing_completion');

  if (idIndex === -1 || promptPriceIndex === -1 || completionPriceIndex === -1) {
    console.error('❌ Required columns not found in CSV');
    console.error('Required: id, pricing_prompt, pricing_completion');
    console.error('Found headers:', headers);
    process.exit(1);
  }

  console.log(`✅ Found ${lines.length - 1} models in CSV`);

  const modelPricing = {};
  let validModels = 0;
  let skippedModels = 0;

  // Process data lines
  for (let i = 1; i < lines.length; i++) {
    try {
      const columns = parseCsvLine(lines[i]);
      
      if (columns.length < Math.max(idIndex, nameIndex, promptPriceIndex, completionPriceIndex) + 1) {
        console.warn(`⚠️  Skipping malformed line ${i + 1}`);
        skippedModels++;
        continue;
      }

      const id = columns[idIndex];
      const name = columns[nameIndex] || '';
      const promptPrice = parseFloat(columns[promptPriceIndex]) || 0;
      const completionPrice = parseFloat(columns[completionPriceIndex]) || 0;

      if (!id) {
        skippedModels++;
        continue;
      }

      // Add main model entry
      modelPricing[id] = {
        prompt: promptPrice,
        completion: completionPrice,
        name: name
      };

      // Add simplified version without provider prefix
      const simplifiedId = id.includes('/') ? id.split('/')[1] : id;
      if (simplifiedId !== id) {
        modelPricing[simplifiedId] = {
          prompt: promptPrice,
          completion: completionPrice
        };
      }

      // Add common aliases
      if (id.includes('gpt-3.5-turbo')) {
        modelPricing['gpt-3.5-turbo'] = { prompt: promptPrice, completion: completionPrice };
      }
      if (id.includes('gpt-4')) {
        modelPricing['gpt-4'] = { prompt: promptPrice, completion: completionPrice };
      }
      if (id.includes('claude-3-sonnet')) {
        modelPricing['claude-3-sonnet'] = { prompt: promptPrice, completion: completionPrice };
        modelPricing['claude-3-sonnet-20240229'] = { prompt: promptPrice, completion: completionPrice };
      }
      if (id.includes('claude-opus')) {
        modelPricing['claude-3-opus'] = { prompt: promptPrice, completion: completionPrice };
      }
      if (id.includes('gemini-pro')) {
        modelPricing['gemini-pro'] = { prompt: promptPrice, completion: completionPrice };
      }

      validModels++;
    } catch (error) {
      console.warn(`⚠️  Error processing line ${i + 1}: ${error.message}`);
      skippedModels++;
    }
  }

  console.log(`✅ Processed ${validModels} valid models`);
  if (skippedModels > 0) {
    console.log(`⚠️  Skipped ${skippedModels} invalid/malformed entries`);
  }

  // Generate the pricing.ts file content
  const currentDate = new Date().toISOString();
  const totalMappings = Object.keys(modelPricing).length;

  const pricingContent = `/**
 * Model Pricing Data
 * 
 * Generated from OpenRouter CSV on ${currentDate}
 * Total models: ${validModels}
 * Total mappings: ${totalMappings}
 * 
 * Pricing is per token (direct from OpenRouter API)
 */

export interface ModelPricing {
  prompt: number
  completion: number
  name?: string
}

export const MODEL_PRICING: Record<string, ModelPricing> = ${JSON.stringify(modelPricing, null, 2)};

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
  let rateInfo = MODEL_PRICING[model]
  
  if (!rateInfo) {
    // Try partial matches
    const modelKey = Object.keys(MODEL_PRICING).find(key => 
      model.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(model.toLowerCase())
    )
    rateInfo = modelKey ? MODEL_PRICING[modelKey] : null
  }
  
  return rateInfo || null
}

export function listAvailableModels(): string[] {
  return Object.keys(MODEL_PRICING).filter(key => MODEL_PRICING[key].name)
}
`;

  // Write the updated pricing file
  const pricingPath = path.join(__dirname, '..', 'src', 'utils', 'pricing.ts');
  fs.writeFileSync(pricingPath, pricingContent);

  console.log(`✅ Updated pricing file: ${pricingPath}`);
  console.log(`📊 Total pricing entries: ${totalMappings}`);
  console.log(`🎯 Includes aliases for common models (gpt-3.5-turbo, claude-3-sonnet, etc.)`);
  
  // Show some sample pricing
  console.log('\n💰 Sample pricing:');
  const samples = ['gpt-3.5-turbo', 'claude-3-sonnet-20240229', 'gemini-pro'];
  samples.forEach(model => {
    const pricing = modelPricing[model];
    if (pricing) {
      const cost1k = (pricing.prompt * 1000).toFixed(6);
      console.log(`   ${model}: $${cost1k} per 1K tokens`);
    }
  });
}

// Main execution
if (require.main === module) {
  const csvPath = process.argv[2];
  
  if (!csvPath) {
    console.error('Usage: node scripts/update-pricing.js path/to/openrouter_pricing.csv');
    process.exit(1);
  }
  
  updatePricingFromCsv(csvPath);
}

module.exports = { updatePricingFromCsv };