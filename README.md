# Daytona.io Project

This project demonstrates how to use Daytona.io SDK to create and run code in sandboxes.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your API key:
   - Edit the `.env` file and replace `your-api-key-here` with your actual Daytona.io API key

3. Run the project:
   ```
   npx tsx index.mts
   ```

## What it does

The application:
1. Creates a Typescript sandbox
2. Runs a simple "Hello World" statement in the sandbox
3. Outputs the result
4. Cleans up by removing the sandbox

## Files

- `index.mts`: Main application code
- `.env`: Environment variables (including API key)
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration