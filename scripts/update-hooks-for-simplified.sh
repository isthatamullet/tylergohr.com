#!/bin/bash

# Update Hooks System for Simplified Dev Server
# Teaches hooks system to use our simplified approach

set -e

echo "🔧 Updating hooks system for simplified dev server approach..."

# Clear the hooks cache that might have complex data
echo "📋 Clearing hooks cache..."
if [[ -f "./scripts/hooks/ensure-port-env.sh" ]]; then
    ./scripts/hooks/ensure-port-env.sh clear
    echo "✅ Hooks cache cleared"
fi

# Set environment using our simplified approach
echo "📍 Setting clean environment..."
eval "$(./scripts/simple-env-setup.sh quiet)"

# Manually create clean hooks cache
echo "💾 Creating clean hooks cache..."
mkdir -p "$HOME/.claude/hooks"
cat > "$HOME/.claude/hooks/environment.cache" << EOF
{
  "timestamp": $(date +%s),
  "port": 3000,
  "url": "http://localhost:3000",
  "environment": "simplified",
  "session": "$$"
}
EOF

echo "✅ Clean hooks cache created"

# Verify
echo "🔍 Verifying hooks system..."
./scripts/hooks/ensure-port-env.sh status

echo ""
echo "🎯 Hooks system updated for simplified approach!"
echo "💡 The hooks system now knows to expect server on port 3000"