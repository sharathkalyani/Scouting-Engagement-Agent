#!/bin/bash

echo "📦 Installing dependencies for Talent Scout Agent..."
echo ""

# Ensure we're in the project root
cd "$(dirname "$0")"

echo "🔧 Installing backend dependencies..."
cd packages/backend
npm install openai uuid @types/node
npm install

echo ""
echo "🔧 Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "🔧 Installing root dependencies..."
cd ../..
npm install

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure backend: cd packages/backend && cp .env.example .env"
echo "2. Add your OpenAI API key to packages/backend/.env"
echo "3. Start development: npm run dev"
