#!/bin/bash

# Interactive cleanup script for IPAM Frontend
# Removes common build artifacts and optionally other files

set -e

echo "🧹 IPAM Frontend Cleanup Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to prompt yes/no
prompt_yn() {
    local prompt="$1"
    local default="${2:-n}"
    local response

    if [[ "$default" == "y" ]]; then
        prompt="$prompt [Y/n]: "
    else
        prompt="$prompt [y/N]: "
    fi

    while true; do
        read -p "$prompt" response
        case "${response:-$default}" in
            [Yy]|[Yy][Ee][Ss]) return 0 ;;
            [Nn]|[Nn][Oo]) return 1 ;;
            "") return $([[ "$default" == "y" ]] && echo 0 || echo 1) ;;
            *) echo "Please answer yes or no." ;;
        esac
    done
}

# Safe removals (no prompt)
echo "Removing common build artifacts..."
rm -rf .next out build dist coverage playwright-report test-results .DS_Store
echo -e "${GREEN}✓ Build artifacts removed${NC}"
echo ""

# Optional removals
if prompt_yn "Remove .env* files (local environment files)?"; then
    rm -f .env*
    echo -e "${GREEN}✓ Environment files removed${NC}"
else
    echo -e "${YELLOW}⚠ Skipped environment files${NC}"
fi

echo ""

if prompt_yn "Remove node_modules (dependencies)?"; then
    rm -rf node_modules
    echo -e "${GREEN}✓ Dependencies removed${NC}"
else
    echo -e "${YELLOW}⚠ Skipped dependencies${NC}"
fi

echo ""
echo -e "${GREEN}Cleanup complete!${NC}"
echo ""
echo "Review the changes with: git status"
echo "Commit safe removals with: git add . && git commit -m 'chore: cleanup build artifacts'"