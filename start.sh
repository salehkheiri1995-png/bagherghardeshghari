#!/bin/bash
# VisitIran Dev Server Launcher

cd "$(dirname "$0")"

echo "============================================"
echo "   VisitIran - Tourism Website"
echo "   Dev Server Launcher"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js v18+ required. Current: $(node -v)"
    exit 1
fi

echo "Node.js: $(node -v)"
echo ""

# Install dependencies
echo "Checking dependencies..."
npm install
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
DATABASE_URL="file:./dev.db"
JWT_SECRET="visitiran-dev-secret-key-change-in-production"
EOF
fi

# Initialize database
echo "Setting up database..."
npx prisma generate --no-engine 2>/dev/null || npx prisma generate

if [ ! -f dev.db ]; then
    echo "Creating database tables..."
    npx prisma db push --skip-generate
    echo "Seeding database..."
    npx tsx prisma/seed.ts
fi

echo ""
echo "============================================"
echo " Starting VisitIran dev server..."
echo " Open http://localhost:3000"
echo " Press Ctrl+C to stop"
echo "============================================"
echo ""

npm run dev
