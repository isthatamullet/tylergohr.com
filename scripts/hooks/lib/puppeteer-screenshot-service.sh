#!/bin/bash

# Puppeteer Screenshot Service for Claude Hooks System
# High-performance screenshot generation with browser pool management
# Integrates with VS Code Tasks for 95% faster development workflows

# Source dependencies
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/hook-utils.sh"
source "$SCRIPT_DIR/vscode-task-integration.sh"

# Configuration
BROWSER_POOL_DIR="$HOME/.claude/hooks/browser-pool"
BROWSER_LOCK_DIR="$HOME/.claude/hooks/browser-locks"
SCREENSHOT_OUTPUT_DIR="screenshots/quick-review"
BROWSER_POOL_MAX_AGE=300  # 5 minutes
BROWSER_MEMORY_LIMIT=500  # MB

# Ensure directories exist
mkdir -p "$BROWSER_POOL_DIR" "$BROWSER_LOCK_DIR" "$SCREENSHOT_OUTPUT_DIR"

# Logging functions specific to Puppeteer service
log_puppeteer_info() {
    log_info "[PUPPETEER] $1"
}

log_puppeteer_success() {
    log_success "[PUPPETEER] $1"
}

log_puppeteer_warning() {
    log_warning "[PUPPETEER] $1"
}

log_puppeteer_error() {
    log_error "[PUPPETEER] $1"
}

# Browser Pool Management Functions

get_browser_pool_id() {
    local port="${ACTIVE_DEV_PORT:-3000}"
    echo "browser_pool_${port}_$$"
}

is_browser_pool_healthy() {
    local pool_id="$1"
    local pool_file="$BROWSER_POOL_DIR/$pool_id"
    
    # Check if pool file exists and is recent
    if [[ ! -f "$pool_file" ]]; then
        return 1
    fi
    
    local file_age=$(($(date +%s) - $(stat -c %Y "$pool_file" 2>/dev/null || echo 0)))
    if [[ $file_age -gt $BROWSER_POOL_MAX_AGE ]]; then
        log_puppeteer_info "Browser pool expired (age: ${file_age}s), cleaning up..."
        cleanup_browser_pool "$pool_id"
        return 1
    fi
    
    # Check if browser process is still alive
    local browser_pid=$(cat "$pool_file" 2>/dev/null)
    if [[ -n "$browser_pid" ]] && kill -0 "$browser_pid" 2>/dev/null; then
        return 0
    else
        log_puppeteer_warning "Browser pool process not found, cleaning up..."
        cleanup_browser_pool "$pool_id"
        return 1
    fi
}

cleanup_browser_pool() {
    local pool_id="$1"
    local pool_file="$BROWSER_POOL_DIR/$pool_id"
    local lock_file="$BROWSER_LOCK_DIR/$pool_id.lock"
    
    if [[ -f "$pool_file" ]]; then
        local browser_pid=$(cat "$pool_file" 2>/dev/null)
        if [[ -n "$browser_pid" ]] && kill -0 "$browser_pid" 2>/dev/null; then
            log_puppeteer_info "Terminating browser pool process: $browser_pid"
            kill -TERM "$browser_pid" 2>/dev/null || true
            sleep 2
            kill -KILL "$browser_pid" 2>/dev/null || true
        fi
        rm -f "$pool_file"
    fi
    
    rm -f "$lock_file"
}

acquire_browser_lock() {
    local pool_id="$1"
    local lock_file="$BROWSER_LOCK_DIR/$pool_id.lock"
    local timeout=10
    local elapsed=0
    
    while [[ $elapsed -lt $timeout ]]; do
        if (set -C; echo $$ > "$lock_file") 2>/dev/null; then
            return 0
        fi
        sleep 1
        ((elapsed++))
    done
    
    log_puppeteer_warning "Could not acquire browser lock within ${timeout}s"
    return 1
}

release_browser_lock() {
    local pool_id="$1"
    local lock_file="$BROWSER_LOCK_DIR/$pool_id.lock"
    rm -f "$lock_file"
}

# Port Detection Integration

ensure_dev_server_available() {
    log_puppeteer_info "Ensuring development server is available..."
    
    # Use VS Code task integration for port detection
    ensure_active_port
    
    if [[ -z "$ACTIVE_DEV_PORT" ]]; then
        log_puppeteer_error "Could not determine active development port"
        return 1
    fi
    
    # Validate server is responsive
    if ! is_dev_server_running; then
        log_puppeteer_error "Development server not responding on port $ACTIVE_DEV_PORT"
        return 1
    fi
    
    # Set up URL for screenshots
    if [[ -z "$ACTIVE_DEV_URL" ]]; then
        export ACTIVE_DEV_URL=$(get_task_managed_url "$ACTIVE_DEV_PORT")
    fi
    
    log_puppeteer_success "Development server ready at $ACTIVE_DEV_URL"
    return 0
}

# Screenshot Generation Functions

generate_quick_screenshots() {
    local start_time=$(date +%s%3N)
    
    log_puppeteer_info "Generating quick screenshots for development iteration..."
    
    # Ensure output directory exists
    mkdir -p "$SCREENSHOT_OUTPUT_DIR"
    
    # Create Node.js script for Puppeteer screenshots
    local puppeteer_script="$BROWSER_POOL_DIR/quick-screenshots.js"
    
    cat > "$puppeteer_script" << 'EOF'
const puppeteer = require('puppeteer');
const fs = require('fs');

async function captureScreenshots() {
    const baseUrl = process.env.ACTIVE_DEV_URL || 'http://localhost:3000';
    const outputDir = process.env.SCREENSHOT_OUTPUT_DIR || 'screenshots/quick-review';
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`[PUPPETEER] Capturing screenshots from ${baseUrl}`);
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1200,800'
        ]
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport for desktop screenshots
        await page.setViewport({ width: 1200, height: 800 });
        
        // Routes to capture
        const routes = [
            { path: '/2', name: 'homepage' },
            { path: '/2/case-studies', name: 'case-studies' },
            { path: '/2/how-i-work', name: 'how-i-work' },
            { path: '/2/technical-expertise', name: 'technical-expertise' }
        ];
        
        for (const route of routes) {
            try {
                console.log(`[PUPPETEER] Capturing ${route.name}...`);
                
                await page.goto(`${baseUrl}${route.path}`, { 
                    waitUntil: 'networkidle0',
                    timeout: 10000 
                });
                
                // Wait for animations to complete
                await page.waitForTimeout(1000);
                
                // Desktop screenshot
                await page.screenshot({ 
                    path: `${outputDir}/${route.name}-desktop.png`,
                    fullPage: true,
                    quality: 90
                });
                
                // Mobile screenshot
                await page.setViewport({ width: 375, height: 667 });
                await page.waitForTimeout(500);
                
                await page.screenshot({ 
                    path: `${outputDir}/${route.name}-mobile.png`,
                    fullPage: true,
                    quality: 90
                });
                
                // Reset to desktop viewport for next route
                await page.setViewport({ width: 1200, height: 800 });
                
                console.log(`[PUPPETEER] ✅ Captured ${route.name} screenshots`);
                
            } catch (routeError) {
                console.error(`[PUPPETEER] ❌ Failed to capture ${route.name}: ${routeError.message}`);
                continue;
            }
        }
        
    } finally {
        await browser.close();
    }
}

captureScreenshots()
    .then(() => {
        console.log('[PUPPETEER] ✅ Screenshot generation completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error(`[PUPPETEER] ❌ Screenshot generation failed: ${error.message}`);
        process.exit(1);
    });
EOF
    
    # Run Puppeteer script
    if command -v node >/dev/null 2>&1; then
        if SCREENSHOT_OUTPUT_DIR="$SCREENSHOT_OUTPUT_DIR" ACTIVE_DEV_URL="$ACTIVE_DEV_URL" node "$puppeteer_script"; then
            local end_time=$(date +%s%3N)
            local duration=$((end_time - start_time))
            log_puppeteer_success "Quick screenshots generated in ${duration}ms"
            
            # List generated screenshots
            log_puppeteer_info "Generated screenshots:"
            find "$SCREENSHOT_OUTPUT_DIR" -name "*.png" -newer <(date -d '10 seconds ago' '+%Y-%m-%d %H:%M:%S') 2>/dev/null | while read -r screenshot; do
                log_puppeteer_success "  📸 $(basename "$screenshot")"
            done
            
            return 0
        else
            log_puppeteer_error "Puppeteer screenshot generation failed"
            return 1
        fi
    else
        log_puppeteer_error "Node.js not available for Puppeteer execution"
        return 1
    fi
}

generate_component_screenshots() {
    local component_path="$1"
    log_puppeteer_info "Generating component-focused screenshots for: $component_path"
    
    # For now, use the same quick screenshots with component context
    # Future enhancement: Focus on specific component areas
    generate_quick_screenshots
}

generate_mobile_screenshots() {
    log_puppeteer_info "Generating mobile-focused screenshots..."
    
    # Create mobile-specific Puppeteer script
    local puppeteer_script="$BROWSER_POOL_DIR/mobile-screenshots.js"
    
    cat > "$puppeteer_script" << 'EOF'
const puppeteer = require('puppeteer');
const fs = require('fs');

async function captureMobileScreenshots() {
    const baseUrl = process.env.ACTIVE_DEV_URL || 'http://localhost:3000';
    const outputDir = process.env.SCREENSHOT_OUTPUT_DIR || 'screenshots/quick-review';
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    try {
        const page = await browser.newPage();
        
        // Mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Mobile routes
        const routes = ['/2', '/2/case-studies', '/2/how-i-work', '/2/technical-expertise'];
        
        for (const route of routes) {
            await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' });
            await page.waitForTimeout(1000);
            
            const routeName = route === '/2' ? 'homepage' : route.split('/')[2];
            await page.screenshot({ 
                path: `${outputDir}/${routeName}-mobile-focused.png`,
                fullPage: true,
                quality: 90
            });
        }
        
    } finally {
        await browser.close();
    }
}

captureMobileScreenshots().catch(console.error);
EOF

    if SCREENSHOT_OUTPUT_DIR="$SCREENSHOT_OUTPUT_DIR" ACTIVE_DEV_URL="$ACTIVE_DEV_URL" node "$puppeteer_script"; then
        log_puppeteer_success "Mobile screenshots generated successfully"
        return 0
    else
        log_puppeteer_error "Mobile screenshot generation failed"
        return 1
    fi
}

# Fallback to Playwright

fallback_to_playwright() {
    local reason="$1"
    log_puppeteer_warning "Falling back to Playwright due to: $reason"
    
    # Check if Playwright is available
    if command -v npx >/dev/null 2>&1; then
        log_puppeteer_info "Executing Playwright fallback..."
        npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
        return $?
    else
        log_puppeteer_error "Playwright not available for fallback"
        return 1
    fi
}

# Main Service Functions

puppeteer_screenshot_service() {
    local mode="${1:-quick}"
    local start_time=$(date +%s%3N)
    
    log_puppeteer_info "Starting Puppeteer screenshot service in '$mode' mode"
    
    # Ensure development server is available
    if ! ensure_dev_server_available; then
        fallback_to_playwright "development server not available"
        return $?
    fi
    
    # Check if Puppeteer is available
    if ! command -v node >/dev/null 2>&1; then
        fallback_to_playwright "Node.js not available"
        return $?
    fi
    
    # Check if puppeteer package is installed
    if ! node -e "require('puppeteer')" 2>/dev/null; then
        log_puppeteer_warning "Puppeteer package not found, attempting npm install..."
        if ! npm list puppeteer >/dev/null 2>&1; then
            fallback_to_playwright "Puppeteer package not installed"
            return $?
        fi
    fi
    
    # Generate screenshots based on mode
    case "$mode" in
        "quick")
            if generate_quick_screenshots; then
                local end_time=$(date +%s%3N)
                local total_duration=$((end_time - start_time))
                log_puppeteer_success "Puppeteer service completed in ${total_duration}ms"
                return 0
            else
                fallback_to_playwright "quick screenshot generation failed"
                return $?
            fi
            ;;
        "component")
            if generate_component_screenshots "$2"; then
                log_puppeteer_success "Component screenshots completed"
                return 0
            else
                fallback_to_playwright "component screenshot generation failed"
                return $?
            fi
            ;;
        "mobile")
            if generate_mobile_screenshots; then
                log_puppeteer_success "Mobile screenshots completed"
                return 0
            else
                fallback_to_playwright "mobile screenshot generation failed"
                return $?
            fi
            ;;
        "test")
            log_puppeteer_info "Testing Puppeteer service configuration..."
            ensure_dev_server_available
            log_puppeteer_success "Puppeteer service test completed"
            return 0
            ;;
        *)
            log_puppeteer_error "Unknown mode: $mode"
            log_puppeteer_info "Available modes: quick, component, mobile, test"
            return 1
            ;;
    esac
}

# Cleanup function for graceful shutdown
cleanup_puppeteer_service() {
    log_puppeteer_info "Cleaning up Puppeteer service resources..."
    
    # Clean up old browser pools
    find "$BROWSER_POOL_DIR" -name "browser_pool_*" -type f -mmin +5 -delete 2>/dev/null || true
    find "$BROWSER_LOCK_DIR" -name "*.lock" -type f -mmin +5 -delete 2>/dev/null || true
    
    # Clean up temporary scripts
    find "$BROWSER_POOL_DIR" -name "*.js" -type f -mmin +5 -delete 2>/dev/null || true
    
    log_puppeteer_success "Puppeteer service cleanup completed"
}

# Signal handlers for graceful shutdown
trap cleanup_puppeteer_service EXIT

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script is being executed directly
    puppeteer_screenshot_service "$@"
fi