#!/usr/bin/env node

/**
 * Environment Setup Script
 * This script helps manage environment variables for the weather app
 */

const fs = require('fs');
const path = require('path');

// Function to create .env file if it doesn't exist
function createEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    const envContent = `# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=your_api_key_here

# App Configuration
NODE_ENV=development
PORT=3000

# Cache Configuration
CACHE_DURATION=600000

# Add your API key to this file and it will be used by the application
# Make sure to add .env to your .gitignore file to keep your API key secure
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file');
    console.log('📝 Please add your OpenWeatherMap API key to the .env file');
  } else {
    console.log('✅ .env file already exists');
  }
}

// Function to validate .env file
function validateEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (!envContent.includes('OPENWEATHER_API_KEY=')) {
    console.log('❌ OPENWEATHER_API_KEY not found in .env file');
    return false;
  }
  
  if (envContent.includes('your_api_key_here')) {
    console.log('⚠️  Please replace "your_api_key_here" with your actual API key');
    return false;
  }
  
  console.log('✅ .env file is properly configured');
  return true;
}

// Main execution
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'init':
      createEnvFile();
      break;
    case 'validate':
      validateEnvFile();
      break;
    default:
      console.log('Usage: node setup-env.js [init|validate]');
      console.log('  init     - Create .env file if it doesn\'t exist');
      console.log('  validate - Validate .env file configuration');
  }
}

if (require.main === module) {
  main();
}

module.exports = { createEnvFile, validateEnvFile }; 