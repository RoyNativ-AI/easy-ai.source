#!/usr/bin/env node
/**
 * Test script to verify EasyAI Node.js interceptor works
 */

console.log("Testing EasyAI Node.js interceptor...");

// This should initialize the interceptor
require('easyai');

const fs = require('fs');
const path = require('path');

// Simulate axios-like request (using Node.js built-in fetch if available, or mock)
const testRequest = async () => {
  try {
    // Mock axios-like request
    const mockAxios = {
      post: async (url, data, config) => {
        console.log(`Mock request: POST ${url}`);
        // This would normally make an HTTP request
        // For testing, we'll just simulate the interceptor logic
        return {
          status: 200,
          data: { choices: [{ message: { content: "Hello! How can I help you?" } }] }
        };
      }
    };

    // Make a mock request to OpenAI
    await mockAxios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello!' }]
    }, {
      headers: { 'Authorization': 'Bearer test-key-will-fail' }
    });

  } catch (error) {
    console.log(`Expected error (no valid API key): ${error.message}`);
  }
};

// Test with real fetch if available (Node.js 18+)
const testFetch = async () => {
  if (typeof global.fetch === 'function') {
    console.log("Testing with fetch...");
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-key-will-fail',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello from Node.js!' }]
        })
      });
      console.log(`Fetch response status: ${response.status}`);
    } catch (error) {
      console.log(`Expected fetch error: ${error.message}`);
    }
  } else {
    console.log("Fetch not available in this Node.js version");
  }
};

const checkLogFile = () => {
  const logFile = 'easyai/logs/calls.jsonl';
  if (fs.existsSync(logFile)) {
    console.log(`\n✅ Log file exists: ${logFile}`);
    
    const content = fs.readFileSync(logFile, 'utf8').trim();
    if (content) {
      console.log("✅ Log file contains data:");
      const lines = content.split('\n');
      const recentLines = lines.slice(-3); // Show last 3 lines
      
      recentLines.forEach((line, index) => {
        try {
          const data = JSON.parse(line);
          console.log(`  Entry ${index + 1}: ${data.method || 'N/A'} ${data.url || 'N/A'}`);
          if (data.requestBody) {
            console.log(`    Request captured: ✅`);
          }
          if (data.provider) {
            console.log(`    Provider: ${data.provider}`);
          }
          if (data.source) {
            console.log(`    Source: ${data.source}`);
          }
        } catch (e) {
          console.log(`  Entry ${index + 1}: ${line.substring(0, 50)}...`);
        }
      });
    } else {
      console.log("❌ Log file is empty");
    }
  } else {
    console.log(`❌ Log file not found: ${logFile}`);
  }
};

// Run tests
(async () => {
  await testRequest();
  await testFetch();
  
  // Give a moment for async logging
  setTimeout(() => {
    checkLogFile();
    console.log("\nNode.js interceptor test completed!");
  }, 1000);
})();