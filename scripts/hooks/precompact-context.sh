#!/bin/bash
# Preserve essential development context for both manual and auto-compact
echo "=== DEVELOPMENT CONTEXT ==="
echo "Current branch: $(git branch --show-current)"
echo "Quality status: $(npm run typecheck >/dev/null 2>&1 && echo 'PASS' || echo 'FAIL')"
echo "Last commit: $(git log -1 --oneline)"

echo ""
echo "=== CONVERSATION LOG REFERENCE ==="
echo "Full conversation history available at: $CLAUDE_TRANSCRIPT_PATH"
echo "📝 Use this log if you need to reference specific tasks or decisions"
echo "💡 Prompt: 'Read the conversation log to see [specific topic]'"