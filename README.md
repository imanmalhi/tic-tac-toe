# Tic-Tac-Toe

A tic-tac-toe game built with React and TypeScript featuring an AI opponent powered by Claude. Demonstrates effective AI-assisted development with clean architecture, comprehensive testing, and automated AWS deployement.

## Quick Start
```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tests
```bash
npm run test:run
```

## Production

Live at https://un4dfr2wv3.us-east-1.awsapprunner.com

## Architecture

The application uses scrict separation between game logic and UI. Core game rules are pure functions in src/logic, completely decoupled from React, makeing them easy to unit test. State management uses a custom hook that encapsulates all transitions. The AI opponent is isolated in src/api, calling the Anthropic API for moves with explanations. If the API fails, it falls back gracefully.

## CI/CD Pipeline

Fully automated using AWS:
- CodePipeline triggers on push to main
- Code Build runs tests and builds Docker image
- ECR stores container images
- App Runner auto-deploys new images

Push to production in about 3 minutes with no manual steps.

## AI Tools Used

Claude Code assisted with implementation based on my specifications. I wrote all type definitions, function signatures, component interfaces, and architectural decisions. Claude Code implemented bodies and generated CSS following detailed prompts. This kept me in control of the design while accelerating implementation.

## What I would Improve

With more time: integration tests for React components, AI difficulty levels, game statistics with localStorage, staging environment with approval gate, blue-green deployments.