#!/bin/bash

set -e

# Secret variable names to check for assignments
SECRET_VARIABLE_NAMES=(
    "OPENAI_API_KEY"
    "DEEPSEEK_API_KEY"
    "GEMINI_API_KEY"
    "GOOGLE_API_KEY"
    "ANTHROPIC_API_KEY"
    "XAI_API_KEY"
    "MISTRAL_API_KEY"
    "GROQ_API_KEY"
    "OPENROUTER_API_KEY"
    "ENCRYPTION_MASTER_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

# Token patterns to detect (parallel arrays for Bash 3 compatibility)
TOKEN_PATTERN_NAMES=(
    "OpenAI or DeepSeek style key"
    "Anthropic style key"
    "Google AI Studio style key"
    "Groq style key"
)

TOKEN_PATTERNS=(
    "sk-(proj-)?[A-Za-z0-9_-]{20,}"
    "sk-ant-[A-Za-z0-9_-]{20,}"
    "AIza[0-9A-Za-z_-]{20,}"
    "gsk_[A-Za-z0-9]{20,}"
)

# Placeholder patterns (case-insensitive)
PLACEHOLDER_PATTERN="(example|placeholder|changeme|replace[-_ ]?me|dummy|sample|fake|redacted)|your[_-][A-Za-z0-9_-]*|<[^>]+>|\.\.\.|xxxxx"

# Build assignment pattern from secret variable names
ASSIGNMENT_PATTERN=""
for var in "${SECRET_VARIABLE_NAMES[@]}"; do
    if [ -n "$ASSIGNMENT_PATTERN" ]; then
        ASSIGNMENT_PATTERN="$ASSIGNMENT_PATTERN|"
    fi
    ASSIGNMENT_PATTERN="$ASSIGNMENT_PATTERN$var"
done
ASSIGNMENT_PATTERN="($ASSIGNMENT_PATTERN)[[:space:]]*[:=][[:space:]]*[\"']?([^[:space:]\"'#]+)"

# Get staged files (excluding package-lock.json)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -v '^$' | grep -v 'package-lock\.json$')

if [ -z "$STAGED_FILES" ]; then
    echo "Secret check: no staged files to inspect."
    exit 0
fi

FAILURES=()
FILE_COUNT=0

while IFS= read -r file_path; do
    FILE_COUNT=$((FILE_COUNT + 1))
    
    # Get file content from git staging area
    CONTENT=$(git show ":$file_path" 2>/dev/null || true)
    if [ $? -ne 0 ] || [ -z "$CONTENT" ]; then
        continue
    fi
    
    # Skip binary files
    if echo "$CONTENT" | grep -q $'\x00'; then
        continue
    fi
    
    LINE_NUMBER=0
    while IFS= read -r line; do
        LINE_NUMBER=$((LINE_NUMBER + 1))
        
        # Check if line contains placeholder text (case-insensitive)
        if echo "$line" | grep -qiE "$PLACEHOLDER_PATTERN"; then
            continue
        fi
        
        # Check for secret variable assignments
        if echo "$line" | grep -qiE "$ASSIGNMENT_PATTERN"; then
            FAILURES+=("$file_path:$LINE_NUMBER Suspicious secret assignment")
            FAILURES+=("  $(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')")
        fi
        
        # Check for token patterns
        for i in "${!TOKEN_PATTERNS[@]}"; do
            pattern="${TOKEN_PATTERNS[$i]}"
            pattern_name="${TOKEN_PATTERN_NAMES[$i]}"
            if echo "$line" | grep -qE "$pattern"; then
                FAILURES+=("$file_path:$LINE_NUMBER $pattern_name")
                FAILURES+=("  $(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')")
            fi
        done
    done <<< "$CONTENT"
done <<< "$STAGED_FILES"

if [ ${#FAILURES[@]} -gt 0 ]; then
    echo "Potential secrets detected in staged content:"
    for failure in "${FAILURES[@]}"; do
        echo "$failure"
    done
    echo ""
    echo "Commit blocked. Remove the secret, replace it with a placeholder, or move it into local environment configuration."
    exit 1
fi

echo "Secret check: scanned $FILE_COUNT staged file(s) and found no obvious secrets."
exit 0
