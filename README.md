# Tic-Tac-Toe

## Running the App
- npm install, then npm run dev for local dev at localhost:5173
- npm run test:run to run the test suite
- Production is deployed via AWS App Runner at https://fym43cwnwp.us-east-1.awsapprunner.com/

## Approach
I built a React/TypeScript tic-tac-toe with a Claude AI opponent and full AWS CI/CD pipeline. The goal was to demonstrate end to end delivery: architecture, tested logic, AI integration, containerized deployment, and automated infrastructure.

I set up the build pipeline before writing any game code so every push is tested and deployed automatically. The codebase is organized by responsibility: types define contracts, game logic is pure functions with no React dependency, the AI module is isolated with graceful fallback, hooks bridge logic to React, and componenets are presentational. This separation makes logic easy to test without mouning components and means any layer can be swapped independently.

The CI/CD pipeline uses CodePipeline watching the main branch. On push, CodeBuild runs tests, builds a multi-stage Docker image, pushes to ECR, and App Runner auto deploys. Tests gate every deployment.

## AI Tools Used
I use the Cursor AI Agent with the Opus 4.5 model from Anthropic throughout this development. I directed the architecture, file structure, and design decisions, then used the Cursor AI Agent to accelerate implementation of functions, test cases, CSS, and boilerplate code. I reviewed all generated code before committing and made corrections where needed. The Cursor AI Agent was useful for scaffolding repetitive patters while I focused on architecrure and integration.

The game also integrates the Claude API as an AI. The AI module sends the board state to the Claude Sonnet 4 model, which returns a move with an explaination of its reasoning.

## What I Would Improve With More Time
- Minimax fallback so the game works offline without an API key
- Move history and undo functionality
- Mobile reponsiveness
- Integration tests for React components
- CloudFormation or Terraform for AWS infrastructure instead of CLI commands
- Error boundary components