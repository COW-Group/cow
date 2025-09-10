#!/bin/bash

# Cycles of Wealth Development Environment Setup
echo "🚀 Setting up Cycles of Wealth development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -c 2-)
REQUIRED_VERSION="18.0.0"

if ! npx semver "$NODE_VERSION" -r ">=$REQUIRED_VERSION" &> /dev/null; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is not supported. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version $NODE_VERSION is compatible${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm is installed${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Create environment files if they don't exist
echo -e "${YELLOW}⚙️  Setting up environment files...${NC}"

if [ ! -f .env.local ]; then
    cp .env.example .env.local 2>/dev/null || {
        echo "# Development Environment Variables" > .env.local
        echo "NODE_ENV=development" >> .env.local
        echo "API_URL=http://localhost:3001" >> .env.local
        echo "DATABASE_URL=postgresql://localhost:5432/cow_dev" >> .env.local
        echo "REDIS_URL=redis://localhost:6379" >> .env.local
        echo "JWT_SECRET=your-super-secret-jwt-key-here" >> .env.local
        echo "BLOCKCHAIN_NETWORK=polygon-mumbai" >> .env.local
        echo "WEB3_PROVIDER_URL=https://rpc-mumbai.matic.today" >> .env.local
    }
    echo -e "${GREEN}✅ Created .env.local file${NC}"
fi

# Check if Docker is available for local services
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is available for local services${NC}"
    echo -e "${YELLOW}💡 You can run 'docker-compose up -d' to start local database and cache services${NC}"
else
    echo -e "${YELLOW}⚠️  Docker is not available. You'll need to set up PostgreSQL and Redis manually${NC}"
fi

# Create local development database if PostgreSQL is available
if command -v createdb &> /dev/null; then
    echo -e "${YELLOW}🗄️  Setting up local database...${NC}"
    createdb cow_dev 2>/dev/null && echo -e "${GREEN}✅ Created development database${NC}" || echo -e "${YELLOW}⚠️  Database might already exist${NC}"
fi

# Build shared libraries
echo -e "${YELLOW}🔧 Building shared libraries...${NC}"
npx nx run-many --target=build --projects=shared-ui,platform-core,business-engine,blockchain-core --parallel

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Shared libraries built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build shared libraries${NC}"
    exit 1
fi

# Run initial linting
echo -e "${YELLOW}🔍 Running initial lint check...${NC}"
npx nx run-many --target=lint --all --parallel

echo ""
echo -e "${GREEN}🎉 Development environment setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review and update .env.local with your specific configuration"
echo "2. Start the development servers: npm run dev"
echo "3. Open your browser to:"
echo "   - Public Site: http://localhost:4200"
echo "   - Platform App: http://localhost:4201"
echo ""
echo -e "${YELLOW}Available commands:${NC}"
echo "npm run dev              - Start all development servers"
echo "npm run serve:public-site - Start only the public site"
echo "npm run serve:platform-app - Start only the platform app"
echo "npm run build            - Build all applications"
echo "npm test                 - Run all tests"
echo "npm run lint             - Lint all code"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"