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
      timeout: 60000 // Increased timeout to give more time
    });

    console.log('Creating sandbox...');
    const sandbox = await daytona.create({
      language: 'typescript',
    });

    console.log('Sandbox created successfully, running code...');
    
    // Modified code to return the formatted Bitcoin price
    const response = await sandbox.process.codeRun(`
      async function getBitcoinPrice() {
        console.log("Starting API request to CoinGecko...");
        try {
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
          console.log("API response status:", response.status);
          
          if (!response.ok) {
            throw new Error(\`API responded with status \${response.status}\`);
          }
          
          const text = await response.text();
          console.log("Raw response text:", text);
          
          const data = JSON.parse(text);
          console.log("Parsed data:", data);
          
          if (!data.bitcoin || typeof data.bitcoin.usd !== 'number') {
            throw new Error("Unexpected API response format");
          }
          
          return data.bitcoin.usd;
        } catch (err) {
          console.error("Error in getBitcoinPrice:", err);
          throw err;
        }
      }
      
      // Execute the function and return its result with formatting
      (async () => {
        try {
          console.log("Starting to fetch Bitcoin price...");
          const price = await getBitcoinPrice();
          console.log("Bitcoin price fetched:", price);
          
          // Format the price in USD before returning
          const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(price);
          
          console.log("Formatted price:", formattedPrice);
          return formattedPrice; // Return the formatted price
        } catch (error) {
          console.error("Caught error:", error);
          return \`Error: \${error instanceof Error ? error.message : String(error)}\`;
        }
      })();
    `);
    
    console.log('Full response from sandbox:', response);
    
    // Display the already formatted price
    if (response && response.result !== undefined) {
      console.log('Bitcoin price:', response.result);
    } else {
      console.log('No valid result returned from sandbox');
    }

    console.log('Cleaning up...');
    await daytona.remove(sandbox);
    console.log('Sandbox removed successfully');
  } catch (error) {
    console.error('Error details:', error);
    
    if ('isAxiosError' in error) {
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