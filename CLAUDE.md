This is a tic-tac-toe game built with React and TypeScript using Vite. The architecture prioritizes separation of concerns and testability.

Tech stack: React 18, TypeScript, Vite, CSS Modules, Vitest for testing. No external UI libraries.

Project structure: types in src/typles, pure game logic in src/logic with accompanying tests, AI opponent module in src/api, custom hooks in src/hooks, UI components in src/components. App.tsx wires everything together.

Code standards: functional components only, explicit return types on all functions, pure functions where possible, comprehensive interfaces for all props and state.

Testing strategy: unit tests for all pure game logic functions. Tests live alongside source files with .test.ts extension.

AI integration: optional AI opponent using Anthropic API. Isolated in its own module so core game works without API access.

Deployment: multi-stage Docker build with nginx. AWS CodePipeline triggers on push, CodeBuild runs tests and builds image, ECR stores images, App Runner auto-deploys.