#!/usr/bin/env node
/**
 * Test script to check what the /api/logs endpoint is returning
 */

const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 7542,
    path: '/api/logs?limit=10',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
      console.log('\n=== API Response ===');
      
      try {
        const parsedData = JSON.parse(data);
        console.log('Number of log entries:', parsedData.length);
        
        if (parsedData.length > 0) {
          console.log('\n=== First Log Entry ===');
          console.log(JSON.stringify(parsedData[0], null, 2));
        }
        
        // Check required fields
        parsedData.forEach((entry, index) => {
          const missingFields = [];
          const requiredFields = ['id', 'timestamp', 'prompt', 'model', 'response', 'success'];
          
          requiredFields.forEach(field => {
            if (!entry.hasOwnProperty(field)) {
              missingFields.push(field);
            }
          });
          
          if (missingFields.length > 0) {
            console.log(`\nEntry ${index} missing fields:`, missingFields);
          }
        });
        
      } catch (error) {
        console.error('Failed to parse JSON response:', error);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request failed:', error);
  });

  req.end();
}

console.log('Testing /api/logs endpoint...');
testAPI();