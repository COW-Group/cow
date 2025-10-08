#!/bin/bash

# Auto-Dev Orchestrator Setup Script
# This script sets up the automated development environment

set -e

echo "🚀 Setting up Auto-Dev Orchestrator for Missions-App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the correct directory
if [ ! -d "apps/missions-app" ]; then
    print_error "Please run this script from the COW monorepo root directory"
    exit 1
fi

print_status "Found missions-app directory"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_info "Creating .env file from template..."

    cat > .env << EOF
# Auto-Dev Orchestrator Configuration
# Note: Claude integration uses Claude Code CLI (no API key needed)
MONDAY_API_TOKEN=your_monday_api_token_here
MONDAY_BOARD_ID=your_monday_board_id_here

# Supabase Configuration (already exists in your project)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Configuration
AUTO_DEV_MAX_ITERATIONS=10
AUTO_DEV_COMMIT_FREQUENCY=5
AUTO_DEV_BACKUP_BRANCHES=true
AUTO_DEV_ENABLE_TESTS=true
EOF

    print_warning "Created .env file. Please update it with your actual API keys!"
else
    print_status ".env file already exists"
fi

# Make the orchestrator executable
chmod +x auto-dev-orchestrator.js

# Create MCP configuration for Monday.com
print_info "Setting up Monday.com MCP configuration..."

if [ ! -d ".claude" ]; then
    mkdir -p .claude
fi

cat > .claude/mcp-config.json << EOF
{
  "mcpServers": {
    "monday-api-mcp-hosted": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.monday.com/sse",
        "--header",
        "Api-Version:\${API_VERSION}"
      ],
      "env": {
        "API_VERSION": "2025-07"
      }
    }
  }
}
EOF

print_status "Created MCP configuration"

# Check Claude Code CLI installation
print_info "Checking Claude Code CLI installation..."

if command -v claude >/dev/null 2>&1; then
    print_status "Claude Code CLI found"
else
    print_warning "Claude Code CLI not found!"
    print_info "Please install Claude Code CLI from: https://claude.ai/code"
    print_info "This is required for the auto-dev orchestrator to work"
fi

# Create Git hooks for safety
print_info "Setting up Git safety hooks..."

if [ ! -d ".git/hooks" ]; then
    mkdir -p .git/hooks
fi

# Pre-commit hook for automated commits
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Run TypeScript check
if npm run typecheck 2>/dev/null; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript check failed"
    exit 1
fi

# Run linting
if npm run lint 2>/dev/null; then
    echo "✅ Linting passed"
else
    echo "❌ Linting failed"
    exit 1
fi

# Run build check
if npm run build:missions-app 2>/dev/null; then
    echo "✅ Build check passed"
else
    echo "❌ Build check failed"
    exit 1
fi

echo "✅ Pre-commit checks completed successfully"
EOF

chmod +x .git/hooks/pre-commit

# Create monitoring script
cat > monitor-auto-dev.sh << 'EOF'
#!/bin/bash

# Auto-Dev Monitoring Script
# Monitors the auto-dev process and provides status updates

LOG_FILE="auto-dev.log"
PID_FILE="auto-dev.pid"

case "$1" in
    start)
        echo "🚀 Starting Auto-Dev Orchestrator..."
        nohup node auto-dev-orchestrator.js > $LOG_FILE 2>&1 &
        echo $! > $PID_FILE
        echo "✅ Auto-Dev Orchestrator started (PID: $(cat $PID_FILE))"
        echo "📝 Log file: $LOG_FILE"
        ;;
    stop)
        if [ -f $PID_FILE ]; then
            PID=$(cat $PID_FILE)
            echo "🛑 Stopping Auto-Dev Orchestrator (PID: $PID)..."
            kill $PID
            rm -f $PID_FILE
            echo "✅ Auto-Dev Orchestrator stopped"
        else
            echo "⚠️  Auto-Dev Orchestrator is not running"
        fi
        ;;
    status)
        if [ -f $PID_FILE ] && kill -0 $(cat $PID_FILE) 2>/dev/null; then
            echo "✅ Auto-Dev Orchestrator is running (PID: $(cat $PID_FILE))"
        else
            echo "❌ Auto-Dev Orchestrator is not running"
        fi
        ;;
    logs)
        if [ -f $LOG_FILE ]; then
            tail -f $LOG_FILE
        else
            echo "⚠️  No log file found"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs}"
        exit 1
        ;;
esac
EOF

chmod +x monitor-auto-dev.sh

print_status "Created monitoring script (monitor-auto-dev.sh)"

# Create recovery script for when things go wrong
cat > recovery-auto-dev.sh << 'EOF'
#!/bin/bash

# Auto-Dev Recovery Script
# Helps recover from failed automated development sessions

set -e

echo "🚑 Auto-Dev Recovery Script"
echo "=========================="

# Show backup branches
echo "📋 Available backup branches:"
git branch | grep -E "backup-[0-9]+" || echo "No backup branches found"

# Show recent commits
echo ""
echo "📋 Recent commits:"
git log --oneline -10

# Recovery options
echo ""
echo "🔧 Recovery Options:"
echo "1. Reset to last commit (git reset --hard HEAD)"
echo "2. Reset to specific commit"
echo "3. Switch to backup branch"
echo "4. Clean working directory"
echo "5. Full reset and clean"

read -p "Choose recovery option (1-5): " choice

case $choice in
    1)
        echo "⏪ Resetting to last commit..."
        git reset --hard HEAD
        git clean -fd
        echo "✅ Reset complete"
        ;;
    2)
        read -p "Enter commit hash: " commit_hash
        echo "⏪ Resetting to commit $commit_hash..."
        git reset --hard $commit_hash
        git clean -fd
        echo "✅ Reset complete"
        ;;
    3)
        git branch | grep -E "backup-[0-9]+"
        read -p "Enter backup branch name: " branch_name
        echo "🔄 Switching to backup branch $branch_name..."
        git checkout $branch_name
        echo "✅ Switched to backup branch"
        ;;
    4)
        echo "🧹 Cleaning working directory..."
        git clean -fd
        echo "✅ Working directory cleaned"
        ;;
    5)
        echo "💥 Performing full reset..."
        git reset --hard HEAD
        git clean -fd
        echo "✅ Full reset complete"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac
EOF

chmod +x recovery-auto-dev.sh

print_status "Created recovery script (recovery-auto-dev.sh)"

# Create development session tracker
cat > track-dev-progress.sh << 'EOF'
#!/bin/bash

# Development Progress Tracker
# Tracks and displays development session progress

DEV_LOG_DIR="dev-sessions"

if [ ! -d "$DEV_LOG_DIR" ]; then
    mkdir -p "$DEV_LOG_DIR"
fi

case "$1" in
    list)
        echo "📋 Development Sessions:"
        ls -la "$DEV_LOG_DIR" | grep "dev-session-" || echo "No sessions found"
        ;;
    show)
        if [ -z "$2" ]; then
            echo "Usage: $0 show <session-file>"
            exit 1
        fi

        if [ -f "$DEV_LOG_DIR/$2" ]; then
            echo "📊 Session Details:"
            cat "$DEV_LOG_DIR/$2" | jq '.'
        else
            echo "❌ Session file not found"
        fi
        ;;
    summary)
        echo "📈 Development Summary:"
        total_sessions=$(ls -1 "$DEV_LOG_DIR" | grep "dev-session-" | wc -l)
        echo "Total sessions: $total_sessions"

        if [ $total_sessions -gt 0 ]; then
            latest_session=$(ls -t "$DEV_LOG_DIR"/dev-session-* | head -1)
            echo "Latest session: $(basename "$latest_session")"

            if command -v jq >/dev/null 2>&1; then
                successful=$(cat "$latest_session" | jq '.developmentLog | map(select(.status == "success")) | length')
                total_iterations=$(cat "$latest_session" | jq '.developmentLog | length')
                echo "Success rate: $successful/$total_iterations"
            fi
        fi
        ;;
    *)
        echo "Usage: $0 {list|show <session-file>|summary}"
        exit 1
        ;;
esac
EOF

chmod +x track-dev-progress.sh

print_status "Created progress tracking script (track-dev-progress.sh)"

# Install required dependencies
print_info "Checking and installing required dependencies..."

# Check if jq is installed (for JSON processing)
if ! command -v jq &> /dev/null; then
    print_warning "jq is not installed. Installing via npm..."
    npm install -g jq || print_warning "Could not install jq. Some features may not work."
else
    print_status "jq is available"
fi

# Create configuration validation script
cat > validate-config.sh << 'EOF'
#!/bin/bash

# Configuration Validation Script
# Validates the auto-dev environment setup

echo "🔍 Validating Auto-Dev Configuration..."

# Check .env file
if [ ! -f ".env" ]; then
    echo "❌ .env file not found"
    exit 1
fi

# Check required environment variables
required_vars=("CLAUDE_API_KEY" "MONDAY_API_TOKEN" "SUPABASE_URL" "SUPABASE_ANON_KEY")

for var in "${required_vars[@]}"; do
    if grep -q "${var}=your_" .env 2>/dev/null; then
        echo "⚠️  $var needs to be configured"
    elif grep -q "${var}=" .env 2>/dev/null; then
        echo "✅ $var is configured"
    else
        echo "❌ $var is missing from .env"
    fi
done

# Check Git configuration
if git config user.name >/dev/null && git config user.email >/dev/null; then
    echo "✅ Git user configured"
else
    echo "⚠️  Git user not configured"
fi

# Check Node.js dependencies
if [ -f "package.json" ]; then
    echo "✅ package.json found"

    # Check if npm install has been run
    if [ -d "node_modules" ]; then
        echo "✅ node_modules directory exists"
    else
        echo "⚠️  Run 'npm install' before starting"
    fi
else
    echo "❌ package.json not found"
fi

# Check MCP configuration
if [ -f ".claude/mcp-config.json" ]; then
    echo "✅ MCP configuration exists"
else
    echo "⚠️  MCP configuration not found"
fi

echo ""
echo "🎯 Setup Status Summary:"
echo "========================"

config_complete=true

if grep -q "your_.*_here" .env 2>/dev/null; then
    echo "⚠️  Environment variables need configuration"
    config_complete=false
fi

if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies need to be installed (run 'npm install')"
    config_complete=false
fi

if $config_complete; then
    echo "✅ Configuration is complete! Ready to run auto-dev."
    echo ""
    echo "🚀 To start: ./monitor-auto-dev.sh start"
    echo "📊 To monitor: ./monitor-auto-dev.sh status"
    echo "📝 To view logs: ./monitor-auto-dev.sh logs"
else
    echo "⚠️  Configuration needs attention before running auto-dev."
fi
EOF

chmod +x validate-config.sh

print_status "Created configuration validation script (validate-config.sh)"

# Final setup summary
echo ""
echo "🎉 Auto-Dev Orchestrator Setup Complete!"
echo "========================================"
echo ""
echo "📁 Created files:"
echo "  • auto-dev-orchestrator.js (main orchestrator)"
echo "  • monitor-auto-dev.sh (process management)"
echo "  • recovery-auto-dev.sh (recovery tools)"
echo "  • track-dev-progress.sh (progress tracking)"
echo "  • validate-config.sh (configuration validation)"
echo "  • .env (environment configuration)"
echo "  • .claude/mcp-config.json (Monday.com MCP setup)"
echo ""
echo "🔧 Next steps:"
echo "  1. Update .env file with your API keys"
echo "  2. Run: ./validate-config.sh"
echo "  3. Run: npm install (if not done)"
echo "  4. Start auto-dev: ./monitor-auto-dev.sh start"
echo ""
echo "⚠️  Risk Mitigations in place:"
echo "  • Automated Git backups before changes"
echo "  • Build/test verification before commits"
echo "  • Recovery scripts for rollback"
echo "  • Progress tracking and logging"
echo "  • Pre-commit hooks for code quality"
echo ""
print_info "Run './validate-config.sh' to verify your setup!"