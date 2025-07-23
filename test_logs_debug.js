#!/usr/bin/env node
/**
 * Test script to debug the log transformation issue
 */

const http = require('http');

// Test the debug endpoint
function testDebugEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 7542,
    path: '/api/logs/debug',
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
      console.log('=== DEBUG ENDPOINT RESPONSE ===');
      console.log('Status Code:', res.statusCode);
      
      try {
        const parsedData = JSON.parse(data);
        console.log('File path:', parsedData.file_path);
        console.log('Total lines:', parsedData.total_lines);
        console.log('\n=== Raw Lines ===');
        parsedData.raw_lines?.forEach((line, i) => {
          console.log(`Line ${i}:`, JSON.stringify(line, null, 2));
        });
        
        console.log('\n=== Transformed Lines ===');
        parsedData.transformed_lines?.forEach((transformed, i) => {
          console.log(`\nTransformation ${i}:`);
          console.log('Should transform:', transformed.should_transform);
          if (transformed.error) {
            console.log('ERROR:', transformed.error);
          } else {
            console.log('Original type:', transformed.original?.type);
            console.log('Transformed result:', transformed.transformed ? 'SUCCESS' : 'NULL');
            if (transformed.transformed) {
              console.log('Transformed fields:', Object.keys(transformed.transformed));
              console.log('Prompt:', transformed.transformed.prompt?.substring(0, 50) + '...');
              console.log('Response:', transformed.transformed.response?.substring(0, 50) + '...');
            }
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

// Test the logs endpoint
function testLogsEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 7542,
    path: '/api/logs?limit=5',
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
      console.log('\n\n=== LOGS ENDPOINT RESPONSE ===');
      console.log('Status Code:', res.statusCode);
      
      try {
        const parsedData = JSON.parse(data);
        console.log('Number of log entries:', parsedData.length);
        
        if (parsedData.length > 0) {
          console.log('\n=== First Log Entry ===');
          console.log('ID:', parsedData[0].id);
          console.log('Timestamp:', parsedData[0].timestamp);
          console.log('Model:', parsedData[0].model);
          console.log('Prompt:', parsedData[0].prompt?.substring(0, 100));
          console.log('Response:', parsedData[0].response?.substring(0, 100));
          console.log('Success:', parsedData[0].success);
          console.log('All fields:', Object.keys(parsedData[0]));
        }
        
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

console.log('Testing debug endpoint...');
testDebugEndpoint();

setTimeout(() => {
  testLogsEndpoint();
}, 1000);