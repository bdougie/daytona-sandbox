import { Daytona } from '@daytonaio/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if API key is set
if (!process.env.DAYTONA_API_KEY) {
  console.error('Error: DAYTONA_API_KEY is not set in .env file');
  process.exit(1);
}

async function runDaytona() {
  try {
    console.log('Initializing Daytona client...');
    const daytona = new Daytona({ 
      apiKey: process.env.DAYTONA_API_KEY,
      // Add timeout to avoid hanging indefinitely
      timeout: 30000 
    });

    console.log('Creating sandbox...');
    const sandbox = await daytona.create({
      language: 'typescript',
    });

    console.log('Sandbox created successfully, running code...');
    const response = await sandbox.process.codeRun('console.log("Hello World from code!")')
    console.log('Code execution result:', response.result);

    console.log('Cleaning up...');
    await daytona.remove(sandbox);
    console.log('Sandbox removed successfully');
  } catch (error) {
    console.error('Error details:', error);
    
    if (error.isAxiosError) {
      console.error('API Response details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
  }
}

runDaytona();
