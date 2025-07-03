# Claude Hooks Orchestration System
**Technical Specification for Intelligent Hook Management**

## Executive Summary

### Current Problem: Hook Timeout Cascade Failures
The Tyler Gohr Portfolio development environment uses a comprehensive Claude Code hooks system that has evolved into a **performance bottleneck causing systematic timeouts**:

- **22 hook matchers** trigger simultaneously for file edits
- **10+ minute execution chains** exceed Claude's 60-second timeout limit
- **"Hook execution timed out. All remaining PostToolUse:Write commands were cancelled"** errors block development
- **Redundant operations** across multiple hooks (TypeScript validation, port detection, screenshot generation)
- **Resource conflicts** from parallel execution without coordination

### Proposed Solution: Dynamic Hook Orchestration
Transform the current static, parallel hook system into an **intelligent orchestration engine** that:

1. **Analyzes change context** dynamically to determine required operations
2. **Optimizes execution strategy** (parallel when safe, sequential when dependent)
3. **Manages 60-second timeout constraint** through intelligent operation sizing
4. **Eliminates redundant work** via shared resource pooling and operation caching
5. **Provides context-aware optimization** for /2 redesign vs main portfolio workflows

**Expected Performance Impact:**
- Hook execution time: **10+ minutes → <45 seconds** (within Claude timeout limit)
- Development iteration speed: **80% improvement** through eliminated waits
- Quality gate reliability: **100% success rate** vs current timeout failures
- Resource efficiency: **60% reduction** in redundant operations

---

## Current Hook System Inventory

### Hook Configuration Overview (`~/.claude/settings.json`)

#### PreToolUse Hooks (2 matchers)
1. **Conditional Port Detection Meta-Hook**
   - **Matcher**: `Bash.*dev|Bash.*playwright|Bash.*test:e2e|Edit.*\.(tsx|css|module\.css)$|Write.*components/|.*test.*|.*visual.*`
   - **Script**: `conditional-port-detection.sh`
   - **Purpose**: Intelligent port detection only when needed
   - **Execution Time**: 100ms - 5 seconds
   - **Resource Impact**: Low (network calls, caching)

2. **Pre-Edit Validation**
   - **Matcher**: `Edit|Write|MultiEdit`
   - **Script**: `pre-edit-validation.sh`
   - **Purpose**: File protection and pre-edit safety checks
   - **Execution Time**: 30-60 seconds (includes TypeScript validation)
   - **Resource Impact**: High (TypeScript compilation, file system validation)

#### PostToolUse Hooks (8 matchers)
1. **TypeScript Component Quality Gate**
   - **Matcher**: `Edit.*\.tsx?$`
   - **Script**: `post-edit-quality-gate.sh component`
   - **Operations**: TypeScript validation → Component testing → Quality reporting
   - **Execution Time**: 2-5 minutes
   - **Resource Impact**: High (npm test:e2e:dev, TypeScript compiler)

2. **CSS Module Visual Workflow**
   - **Matcher**: `Edit.*\.module\.css$`
   - **Script**: `visual-development-workflow.sh`
   - **Operations**: Visual change detection → Screenshot generation → Regression testing
   - **Execution Time**: 3-8 minutes
   - **Resource Impact**: Very High (Playwright automation, screenshot generation)

3. **Brand Tokens Design System Validation**
   - **Matcher**: `Edit.*brand-tokens\.css$`
   - **Script**: `visual-development-workflow.sh` + `performance-excellence-check.sh design_system`
   - **Operations**: Visual testing + Performance validation for design system changes
   - **Execution Time**: 5-12 minutes
   - **Resource Impact**: Very High (comprehensive visual + performance testing)

4. **Component Directory Quality Gate**
   - **Matcher**: `Edit.*components/.*\.(tsx|css)$`
   - **Script**: `post-edit-quality-gate.sh component` + `performance-excellence-check.sh ui-component`
   - **Operations**: Component validation + UI performance testing
   - **Execution Time**: 4-8 minutes
   - **Resource Impact**: Very High (E2E testing + performance profiling)

5. **/2 Redesign Workflow**
   - **Matcher**: `Edit.*app/2/.*\.(tsx|css)$`
   - **Script**: `post-edit-quality-gate.sh component` + `visual-development-workflow.sh`
   - **Operations**: /2-specific component testing + visual validation
   - **Execution Time**: 3-6 minutes
   - **Resource Impact**: High (/2 redesign optimized testing)

6. **Layout/Page Comprehensive Validation**
   - **Matcher**: `Edit.*(layout|page)\.tsx$`
   - **Script**: `post-edit-quality-gate.sh layout` + `performance-excellence-check.sh layout`
   - **Operations**: Layout testing + performance impact validation
   - **Execution Time**: 4-10 minutes
   - **Resource Impact**: Very High (comprehensive layout testing)

7. **Dev Server Post-Start Validation**
   - **Matcher**: `Bash.*dev`
   - **Script**: `post-dev-server-start.sh`
   - **Operations**: Dev server health check + port caching + environment updates
   - **Execution Time**: 5-15 seconds
   - **Resource Impact**: Low (health checks, caching)

8. **Image Asset Performance Validation**
   - **Matcher**: `Edit.*\.(png|jpg|jpeg|svg|webp)$`
   - **Script**: `performance-excellence-check.sh image-asset`
   - **Operations**: Image optimization validation + performance impact
   - **Execution Time**: 1-3 minutes
   - **Resource Impact**: Medium (image analysis, bundle impact)

9. **General Write Operations**
   - **Matcher**: `Write|MultiEdit`
   - **Script**: `post-edit-quality-gate.sh general`
   - **Operations**: General quality validation for new files/multi-file edits
   - **Execution Time**: 2-4 minutes
   - **Resource Impact**: Medium (TypeScript + basic testing)

#### Notification & Stop Hooks (2 global matchers)
1. **Development Context Optimizer (Notification)**
   - **Matcher**: `.*` (all operations)
   - **Script**: `development-context-optimizer.sh notification`
   - **Purpose**: Context-aware development optimization
   - **Execution Time**: <100ms
   - **Resource Impact**: Low (context detection, optimization suggestions)

2. **Post-Work Cleanup (Stop)**
   - **Matcher**: `.*` (all sessions)
   - **Script**: `development-context-optimizer.sh post_work`
   - **Purpose**: Cleanup and optimization at session end
   - **Execution Time**: <500ms
   - **Resource Impact**: Low (cleanup operations, session state)

---

## Individual Hook Script Analysis

### Core Hook Scripts (`scripts/hooks/`)

#### 1. `conditional-port-detection.sh` (Meta-Hook)
**Purpose**: Intelligent port detection only when operations need development server access

**Key Features:**
- **Context Analysis**: Determines if operation needs port detection (dev server, testing, visual work)
- **Ultra-Fast Exit**: Skip port detection for text/config operations (reduces unnecessary overhead)
- **Operation Context Export**: Provides context to other hooks (`PORT_DETECTION_CONTEXT`)
- **Dev Server Cleanup**: Special handling for dev server start operations

**Performance Characteristics:**
- Fast exit for non-dev operations: **<100ms**
- Port detection operations: **1-5 seconds**
- Dev server start cleanup: **3-8 seconds**

**Smart Decision Matrix:**
```bash
# NEEDS port detection:
- Dev server operations (npm run dev)
- Testing operations (playwright, test:e2e)
- Visual/UI operations (.tsx, .css, components/)
- /2 redesign work (app/2/)
- Brand tokens changes (brand-tokens.css)

# SKIPS port detection:
- Documentation (.md, .txt)
- Configuration (.json, .yml, types/)
- Git operations (commit, push, pull)
```

#### 2. `pre-edit-validation.sh` (Safety Gate)
**Purpose**: File protection and pre-edit validation

**Operations:**
- Critical file protection validation
- TypeScript syntax pre-check
- Development context verification
- Safety warnings for protected operations

**Performance Impact**: **30-60 seconds** (includes `npm run typecheck`)

#### 3. `post-edit-quality-gate.sh` (Quality Validation)
**Purpose**: Post-edit quality validation with smart test selection

**Core Operations:**
1. **TypeScript Validation** (30-60s)
2. **Smart Test Strategy Determination**
3. **Test Execution** based on change type:
   - Smoke tests: <1 minute
   - Component tests: 2-3 minutes  
   - Comprehensive tests: 8-10 minutes
4. **Quality reporting and metrics**

**Test Strategy Matrix:**
- **Component changes**: `npm run test:e2e:dev` (2-3 min)
- **Layout changes**: `npm run test:e2e:portfolio` (8-10 min)
- **General changes**: `npm run test:e2e:smoke` (<1 min)

#### 4. `visual-development-workflow.sh` (Visual Validation)
**Purpose**: Visual change detection and screenshot generation

**Core Operations:**
1. **Port detection and dev server validation**
2. **Visual change impact analysis**
3. **Screenshot generation** (multiple viewports)
4. **Visual regression testing**
5. **Accessibility compliance checking**

**Performance Impact**: **3-8 minutes** (Playwright automation, screenshot generation)

**Screenshot Generation:**
- Quick screenshots: `e2e/quick-screenshots.spec.ts` (2-3 min)
- Detail pages: `e2e/detail-pages-screenshots.spec.ts` (1-2 min)
- Comprehensive review: Full visual documentation (5-8 min)

#### 5. `performance-excellence-check.sh` (Performance Monitoring)
**Purpose**: Core Web Vitals and performance impact validation

**Core Operations:**
1. **Development server health verification**
2. **Performance profiling** based on change type:
   - UI components: Animation performance, rendering metrics
   - Design system: Color contrast, accessibility impact
   - Image assets: Optimization validation, bundle impact
   - Layout changes: Core Web Vitals (LCP, FID, CLS)
3. **Performance regression detection**
4. **Optimization recommendations**

**Performance Impact**: **4-8 minutes** (Performance profiling, Core Web Vitals measurement)

#### 6. `post-dev-server-start.sh` (Server Management)
**Purpose**: Post-dev-server startup validation and caching

**Operations:**
- Development server health check
- Port detection and caching
- Environment variable updates
- Session state initialization

**Performance Impact**: **5-15 seconds** (health checks, environment updates)

#### 7. `development-context-optimizer.sh` (Context Intelligence)
**Purpose**: Context-aware development workflow optimization

**Features:**
- Development context detection (main portfolio vs /2 redesign)
- Workflow optimization suggestions
- Session state management
- Performance analytics and reporting

**Performance Impact**: **<500ms** (lightweight context detection)

### Shared Library Utilities (`scripts/hooks/lib/`)

#### Core Utilities
1. **`hook-utils.sh`**: Shared logging, error handling, session management
2. **`port-detection-utils.sh`**: Port detection, dev server validation, caching
3. **`test-selection.sh`**: Smart test strategy determination
4. **`visual-change-detection.sh`**: Visual impact analysis, screenshot coordination
5. **`performance-monitoring.sh`**: Core Web Vitals tracking, performance profiling
6. **`context-detection.sh`**: Development context analysis (main vs /2 redesign)
7. **`file-protection.sh`**: Critical file protection validation

#### Configuration Files (`scripts/hooks/config/`)
1. **`test-strategies.json`**: Test strategy definitions, timing estimates, environment configs
2. **`performance-thresholds.json`**: Core Web Vitals targets, performance SLAs
3. **`visual-change-patterns.json`**: Visual regression detection patterns
4. **`protected-files.json`**: Critical file protection rules
5. **`port-detection-config.json`**: Port detection optimization settings

---

## Performance Analysis & Timeout Issues

### Current Execution Flow Problems

#### 1. Parallel Execution Chaos
**Problem**: Multiple hooks trigger simultaneously without coordination

**Example File Edit Cascade** (editing `/app/2/components/Hero/Hero.tsx`):
```bash
# Triggers simultaneously:
1. conditional-port-detection.sh         # 1-5s
2. pre-edit-validation.sh               # 30-60s (TypeScript check)
3. post-edit-quality-gate.sh component  # 2-5 min (component testing)
4. post-edit-quality-gate.sh component + performance-excellence-check.sh  # 4-8 min
5. post-edit-quality-gate.sh component + visual-development-workflow.sh   # 3-6 min
6. development-context-optimizer.sh     # <100ms

# Total parallel time: 8-12 minutes (multiple hooks hitting 60s timeout)
```

#### 2. Redundant Operations
**Resource Waste Examples:**
- **TypeScript validation** runs in 3+ hooks simultaneously
- **Port detection** happens 4-6 times per edit
- **Dev server health checks** run in every testing hook
- **Screenshot generation** duplicated across visual hooks

#### 3. Resource Conflicts
**Contention Issues:**
- Multiple hooks competing for dev server access
- Simultaneous Playwright browser launches
- Concurrent npm test executions
- File system conflicts during screenshot generation

#### 4. Timeout Cascade Failures
**Current Timeout Behavior** (per Claude documentation):
- Individual hook timeout: **60 seconds**
- Cascade cancellation: **If ANY hook times out, ALL remaining hooks cancelled**
- Current hook chains: **8-12 minutes** (far exceeding 60s limit)

### Hook Execution Time Breakdown

#### Fast Hooks (<30 seconds)
```bash
conditional-port-detection.sh     # 1-5s
post-dev-server-start.sh          # 5-15s  
development-context-optimizer.sh  # <500ms
```

#### Medium Hooks (30s-2 minutes)
```bash
pre-edit-validation.sh           # 30-60s (TypeScript)
post-edit-quality-gate.sh smoke  # <1 min (smoke tests)
performance-excellence-check.sh (image) # 1-3 min
```

#### Heavy Hooks (2+ minutes, causing timeouts)
```bash
post-edit-quality-gate.sh component        # 2-5 min
visual-development-workflow.sh             # 3-8 min
performance-excellence-check.sh (UI)       # 4-8 min
post-edit-quality-gate.sh comprehensive    # 8-10 min

# Combined hook chains: 8-12+ minutes → TIMEOUT
```

### Resource Usage Analysis

#### High Resource Operations
1. **Playwright Automation** (visual-development-workflow.sh)
   - Browser launches and screenshot generation
   - Cross-viewport testing
   - Visual regression analysis

2. **E2E Test Suites** (post-edit-quality-gate.sh)
   - Full portfolio testing (8-10 minutes)
   - Component testing (2-3 minutes)
   - Navigation testing (3-4 minutes)

3. **TypeScript Compilation** (multiple hooks)
   - Full project typecheck (30-60 seconds)
   - Runs redundantly across hooks

4. **Performance Profiling** (performance-excellence-check.sh)
   - Core Web Vitals measurement
   - Bundle analysis and optimization

#### Resource Optimization Opportunities
- **Shared TypeScript validation**: Single validation shared across hooks
- **Port detection caching**: Reuse port detection results
- **Batched screenshot generation**: Combine visual operations
- **Test execution pooling**: Coordinate test execution to prevent conflicts

---

## Orchestration Architecture Design

### Master Orchestrator Overview

#### Core Architecture Components

```bash
scripts/hooks/orchestrator/
├── orchestrator.sh                    # Master entry point
├── execution-engine.sh               # Parallel/sequential execution manager
├── resource-manager.sh               # Shared resource coordination
├── session-state.sh                  # Session state and caching
├── context-analyzer.sh               # Change impact analysis
├── operation-planner.sh              # Execution strategy planning
└── performance-monitor.sh            # Real-time performance tracking
```

### 1. Master Orchestrator (`orchestrator.sh`)

**Purpose**: Single entry point for all hook operations, replacing current 22 individual matchers

**Core Responsibilities:**
- **Input Analysis**: Parse tool name, file path, operation context
- **Change Impact Assessment**: Determine scope and requirements of change
- **Execution Planning**: Create optimal execution strategy
- **Resource Coordination**: Manage shared resources and prevent conflicts
- **Timeout Management**: Ensure 60-second compliance
- **Result Aggregation**: Collect and report all operation results

**Input Processing:**
```bash
# Replace current hook matchers with single orchestrator call:
# ~/.claude/settings.json becomes:
{
  "PreToolUse": [{
    "matcher": ".*",
    "hooks": [{"command": "cd /home/user/tylergohr.com && ./scripts/hooks/orchestrator/orchestrator.sh PreToolUse \"$TOOL_NAME\" \"$TOOL_ARGS\""}]
  }],
  "PostToolUse": [{
    "matcher": ".*", 
    "hooks": [{"command": "cd /home/user/tylergohr.com && ./scripts/hooks/orchestrator/orchestrator.sh PostToolUse \"$TOOL_NAME\" \"$TOOL_ARGS\""}]
  }]
}
```

### 2. Context Analyzer (`context-analyzer.sh`)

**Purpose**: Intelligent analysis of change context to determine required operations

**Analysis Dimensions:**
1. **File Type Analysis**
   - Extension-based operation mapping (.tsx → component testing)
   - Path-based context (/app/2/ → redesign workflow)
   - Special file handling (brand-tokens.css → design system validation)

2. **Change Impact Assessment**
   - Component scope (single component vs layout change)
   - Visual impact (UI changes vs logic changes)
   - Performance impact (rendering changes vs data changes)
   - Accessibility impact (semantic changes vs styling)

3. **Development Context Detection**
   - Main portfolio vs /2 redesign context
   - Development mode vs pre-commit mode
   - Fast iteration vs comprehensive validation

**Decision Matrix Example:**
```bash
# Input: Edit app/2/components/Hero/Hero.tsx
# Analysis Output:
{
  "context": "redesign_2",
  "file_type": "tsx", 
  "component_scope": "ui_component",
  "change_impact": {
    "visual": "medium",
    "performance": "low", 
    "accessibility": "low"
  },
  "required_operations": [
    "typescript_validation",
    "component_testing", 
    "visual_regression"
  ],
  "execution_strategy": "parallel_safe",
  "estimated_time": "180s"
}
```

### 3. Operation Planner (`operation-planner.sh`)

**Purpose**: Create optimal execution plans based on context analysis

**Planning Strategies:**

#### Parallel Execution (Resource-Safe)
```bash
# Independent operations that can run simultaneously:
Group A (Parallel): 
  - TypeScript validation (30-60s)
  - Port detection and caching (1-5s)
  - Context optimization (<1s)

Group B (Parallel):
  - Component testing (60-180s) 
  - Performance validation (60-240s)
  - Accessibility checking (30-120s)
```

#### Sequential Execution (Dependency-Based)
```bash
# Operations with dependencies:
Sequence 1:
  1. Port detection → Dev server validation → Testing operations
  
Sequence 2: 
  1. Visual change detection → Screenshot generation → Visual regression
  
Sequence 3:
  1. Build validation → Performance profiling → Optimization recommendations
```

#### Smart Operation Selection
```bash
# Context-based operation filtering:

Fast Development Mode (target: <30s):
  - TypeScript validation only
  - Smoke tests only  
  - Skip visual regression
  - Skip performance profiling

Standard Development (target: <45s):
  - TypeScript validation
  - Component testing
  - Basic visual validation
  - Skip comprehensive testing

Pre-Commit Mode (target: <120s, manual trigger):
  - Full validation suite
  - Comprehensive testing
  - Complete visual regression
  - Performance profiling
```

### 4. Execution Engine (`execution-engine.sh`)

**Purpose**: Intelligent execution of operation plans with resource management

**Key Features:**

#### Resource Pool Management
```bash
# Shared resources across operations:
PORT_DETECTION_POOL: Single port detection shared across session
TYPESCRIPT_VALIDATION_POOL: Cached TypeScript results  
DEV_SERVER_POOL: Single dev server health check
SCREENSHOT_BATCH_POOL: Batched screenshot generation
```

#### Parallel Execution Coordinator
```bash
# Safe parallel execution with resource isolation:
execute_parallel_group() {
  local operations=("$@")
  local pids=()
  
  # Launch operations in parallel with resource locks
  for operation in "${operations[@]}"; do
    acquire_resource_lock "$operation"
    launch_operation "$operation" &
    pids+=($!)
  done
  
  # Wait for completion with timeout monitoring
  wait_with_timeout "${pids[@]}" 45  # 45s timeout for parallel group
}
```

#### Timeout Enforcement
```bash
# 60-second compliance through operation sizing:
enforce_timeout_compliance() {
  local operation="$1"
  local max_time="$2"
  
  timeout "$max_time" execute_operation "$operation" || {
    log_warning "Operation $operation exceeded ${max_time}s, moving to background"
    queue_background_operation "$operation"
  }
}
```

### 5. Resource Manager (`resource-manager.sh`)

**Purpose**: Centralized resource coordination and conflict prevention

**Resource Management:**

#### Shared State Management
```bash
# Session state shared across all operations:
SHARED_STATE="/tmp/claude-hooks-session-${SESSION_ID}"
{
  "active_port": 3000,
  "typescript_status": "valid",
  "dev_server_health": "healthy",
  "last_port_check": 1625097600,
  "visual_baseline": "current",
  "performance_baseline": {...}
}
```

#### Resource Locking
```bash
# Prevent resource conflicts:
acquire_resource_lock() {
  local resource="$1"
  local lock_file="/tmp/claude-hooks-${resource}.lock"
  
  # Wait for resource availability
  while [ -f "$lock_file" ]; do
    sleep 0.1
  done
  
  # Acquire lock
  echo $$ > "$lock_file"
  trap "rm -f $lock_file" EXIT
}
```

#### Operation Caching
```bash
# Cache expensive operation results:
cache_operation_result() {
  local operation="$1"
  local result="$2"
  local cache_key="cache_${operation}_$(date +%s)"
  
  echo "$result" > "/tmp/claude-hooks-${cache_key}"
  
  # Set TTL for cache invalidation
  (sleep 1800; rm -f "/tmp/claude-hooks-${cache_key}") &
}
```

### 6. Performance Monitor (`performance-monitor.sh`)

**Purpose**: Real-time performance tracking and SLA enforcement

**Monitoring Features:**

#### Real-Time Execution Tracking
```bash
# Track operation performance in real-time:
track_operation_performance() {
  local operation="$1"
  local start_time=$(date +%s%3N)
  
  execute_operation "$operation"
  
  local end_time=$(date +%s%3N) 
  local duration=$((end_time - start_time))
  
  log_performance_metric "$operation" "$duration"
  
  # SLA enforcement
  if [ "$duration" -gt 45000 ]; then  # 45s SLA
    log_warning "Operation $operation exceeded SLA (${duration}ms)"
    optimize_operation "$operation"
  fi
}
```

#### Performance Analytics
```bash
# Generate performance reports:
generate_performance_report() {
  local session_stats="/tmp/claude-hooks-performance-${SESSION_ID}"
  
  {
    echo "=== Hook Performance Report ==="
    echo "Session Duration: ${session_duration}ms"
    echo "Total Operations: ${operation_count}"
    echo "Average Operation Time: ${avg_operation_time}ms"
    echo "SLA Compliance: ${sla_compliance_rate}%"
    echo "Resource Efficiency: ${resource_efficiency}%"
  } > "$session_stats"
}
```

---

## Dynamic Execution Strategies

### Context-Aware Operation Selection

#### 1. File Type → Operations Mapping

##### TypeScript Components (.tsx)
```bash
# Standard component (components/Button/Button.tsx):
OPERATIONS: [typescript_validation, component_testing, accessibility_check]
EXECUTION: parallel_safe
ESTIMATED_TIME: 45-90s
FALLBACK: smoke_tests_only (if time constraint)

# Navigation component (components/Navigation/Navigation.tsx):
OPERATIONS: [typescript_validation, navigation_testing, accessibility_check]
EXECUTION: sequential (navigation tests need clean state)
ESTIMATED_TIME: 60-120s

# Layout component (app/layout.tsx):
OPERATIONS: [typescript_validation, comprehensive_testing, performance_check]
EXECUTION: sequential (comprehensive testing requires isolation)
ESTIMATED_TIME: 120-180s (manual trigger recommended)
```

##### CSS Modules (.module.css)
```bash
# Component styles (Hero.module.css):
OPERATIONS: [build_validation, visual_regression, accessibility_contrast]
EXECUTION: sequential (visual depends on build)
ESTIMATED_TIME: 60-180s

# Brand tokens (brand-tokens.css):
OPERATIONS: [build_validation, comprehensive_visual, performance_check]
EXECUTION: sequential (design system impact)
ESTIMATED_TIME: 120-300s (manual trigger recommended)
```

##### /2 Redesign Context
```bash
# /2 redesign files (app/2/components/**):
OPERATIONS: [typescript_validation, component_testing, visual_regression_2]
EXECUTION: parallel_safe (/2 optimized testing)
ESTIMATED_TIME: 45-90s
OPTIMIZATION: fast_mode_default (redesign workflow optimization)
```

#### 2. Development Context Intelligence

##### Fast Development Mode
```bash
# Active coding session context:
TRIGGER: Multiple rapid edits detected
STRATEGY: minimal_validation
OPERATIONS: [typescript_validation, smoke_tests]
TARGET_TIME: <30s
DEFER: [visual_regression, performance_check] (background queue)
```

##### Standard Development Mode  
```bash
# Normal development workflow:
STRATEGY: balanced_validation
OPERATIONS: [typescript_validation, component_testing, basic_visual]
TARGET_TIME: <45s
DEFER: [comprehensive_testing] (manual trigger)
```

##### Pre-Commit Mode
```bash
# Manual comprehensive validation:
TRIGGER: npm run validate-full OR explicit comprehensive flag
STRATEGY: complete_validation
OPERATIONS: [all_operations]
TARGET_TIME: <120s (manual workflow)
TOLERANCE: Higher timeout acceptable for manual triggers
```

### Parallel vs Sequential Execution Optimization

#### Resource-Safe Parallel Operations
```bash
# Can run simultaneously without conflicts:
Group A: Independent Validation
  - TypeScript validation (CPU-bound)
  - Port detection (network-bound) 
  - Context analysis (lightweight)
  
Group B: Independent Testing
  - Component testing (isolated browser)
  - Accessibility testing (isolated browser)
  - Performance testing (isolated browser with resource monitoring)
```

#### Sequential Dependency Chains
```bash
# Must run in order due to dependencies:
Chain 1: Development Infrastructure
  1. Port detection → 2. Dev server health → 3. Testing operations

Chain 2: Visual Validation  
  1. Build validation → 2. Visual change detection → 3. Screenshot generation → 4. Visual regression

Chain 3: Performance Analysis
  1. Build validation → 2. Performance profiling → 3. Core Web Vitals → 4. Optimization recommendations
```

#### Resource Conflict Prevention
```bash
# Operations that conflict and need coordination:
Conflict Group 1: Browser Resources
  - Visual regression testing
  - Performance profiling  
  - Accessibility testing
  Resolution: Browser pool with resource locks

Conflict Group 2: Dev Server Access
  - E2E testing
  - Screenshot generation
  - Performance monitoring
  Resolution: Shared dev server health validation

Conflict Group 3: File System
  - Screenshot generation
  - Performance reports
  - Test result caching
  Resolution: File system locks and temporary directory isolation
```

### Timeout Management Strategies

#### Operation Sizing for 60-Second Compliance
```bash
# Size operations to fit within Claude's 60s timeout:

Lightweight Operations (0-10s):
  - Port detection and caching
  - Context analysis and planning
  - File protection validation
  - Basic environment checks

Medium Operations (10-30s):
  - TypeScript validation
  - Smoke tests
  - Basic accessibility checks
  - Simple visual validation

Heavy Operations (30-45s):
  - Component testing (e2e:dev)
  - Visual regression (quick screenshots)
  - Performance monitoring (basic metrics)

Background Operations (45s+):
  - Comprehensive testing (e2e:portfolio)
  - Full visual regression
  - Complete performance profiling
  - Bundle analysis
```

#### Background Queue Management
```bash
# Operations that exceed timeout get queued for background execution:
queue_background_operation() {
  local operation="$1"
  local context="$2"
  
  # Add to background queue
  echo "${operation}|${context}|$(date +%s)" >> "/tmp/claude-hooks-background-queue"
  
  # Provide manual command for immediate execution
  log_info "Operation queued for background: $operation"
  log_info "Run manually: npm run ${operation} (or ./scripts/hooks/manual/${operation}.sh)"
}

# Background processor (separate from hook system)
process_background_queue() {
  while IFS='|' read -r operation context timestamp; do
    log_info "Processing background operation: $operation"
    execute_operation_without_timeout "$operation" "$context"
  done < "/tmp/claude-hooks-background-queue"
}
```

---

## Implementation Roadmap

### Phase 1: Orchestrator Foundation (Week 1)

#### 1.1 Create Orchestrator Structure
```bash
# Directory structure setup:
mkdir -p scripts/hooks/orchestrator
mkdir -p scripts/hooks/orchestrator/lib
mkdir -p scripts/hooks/orchestrator/config

# Core files:
scripts/hooks/orchestrator/
├── orchestrator.sh              # Master entry point
├── context-analyzer.sh          # Change impact analysis  
├── operation-planner.sh         # Execution strategy planning
├── execution-engine.sh          # Parallel/sequential execution
├── resource-manager.sh          # Shared resource coordination
├── performance-monitor.sh       # Real-time performance tracking
└── lib/
    ├── orchestrator-utils.sh    # Shared utilities
    ├── operation-definitions.sh # Operation catalog
    └── timeout-management.sh    # Timeout enforcement
```

#### 1.2 Migrate Core Functionality
- **Extract shared logic** from existing hooks into orchestrator utilities
- **Create operation catalog** defining all available operations
- **Implement context analysis** engine for change impact assessment
- **Build operation planner** with parallel/sequential strategy selection

#### 1.3 Develop Resource Management
- **Shared state management** system for session persistence
- **Resource locking** mechanisms to prevent conflicts
- **Operation caching** for expensive operations (TypeScript, port detection)
- **Background queue** system for operations exceeding timeout

### Phase 2: Hook Migration (Week 2) 

#### 2.1 Update Claude Settings Configuration
```bash
# Replace current 22 matchers with single orchestrator entry:
# ~/.claude/settings.json transformation:

# Before (22 individual matchers):
"PreToolUse": [
  {"matcher": "Bash.*dev|Bash.*playwright...", "hooks": [...]},
  {"matcher": "Edit|Write|MultiEdit", "hooks": [...]}
]

# After (single orchestrator):
"PreToolUse": [{
  "matcher": ".*",
  "hooks": [{
    "command": "cd /home/user/tylergohr.com && ./scripts/hooks/orchestrator/orchestrator.sh PreToolUse \"$TOOL_NAME\" \"$TOOL_ARGS\""
  }]
}]
```

#### 2.2 Preserve Existing Hook Logic
- **Wrap existing hooks** within orchestrator execution framework
- **Maintain all current operations** (TypeScript validation, testing, visual regression)
- **Preserve quality standards** while optimizing execution
- **Add orchestrator telemetry** for performance monitoring

#### 2.3 Testing and Validation
- **Parallel testing** of orchestrator vs existing hooks
- **Performance benchmarking** to validate improvements
- **Quality assurance** that all operations still execute correctly
- **Timeout compliance testing** to ensure 60-second adherence

### Phase 3: Optimization and Intelligence (Week 3)

#### 3.1 Implement Smart Operation Selection
- **Context-aware decision trees** for operation selection
- **Development mode detection** (fast iteration vs comprehensive validation)
- **File type intelligence** for optimized testing strategies
- **Change impact analysis** to skip unnecessary operations

#### 3.2 Performance Optimization
- **Parallel execution engine** for resource-safe operations
- **Operation batching** and coordination
- **Intelligent caching** of expensive operations
- **Background processing** for heavy operations

#### 3.3 Advanced Features
- **Performance analytics** and SLA monitoring
- **Self-optimization** based on usage patterns
- **Development workflow integration** with existing npm scripts
- **Manual override commands** for comprehensive validation

### Phase 4: Production Deployment (Week 4)

#### 4.1 Production Readiness
- **Comprehensive testing** across all development scenarios
- **Performance validation** and timeout compliance verification
- **Error handling** and graceful degradation
- **Documentation updates** for new workflow

#### 4.2 Migration Strategy
- **Gradual rollout** with fallback to existing hooks
- **A/B testing** to validate improvements
- **Performance monitoring** during transition
- **User feedback integration** and iteration

#### 4.3 Documentation and Training
- **Update CLAUDE.md** with new orchestrator workflow
- **Create troubleshooting guide** for common issues
- **Performance optimization guide** for custom configurations
- **Advanced usage patterns** for power users

---

## Expected Benefits

### Performance Improvements

#### Execution Time Reduction
- **Current**: 8-12 minute hook chains with timeout failures
- **Target**: <45 second execution with 100% success rate
- **Improvement**: **80-85% faster** development iteration

#### Resource Efficiency
- **Eliminated redundancy**: Single TypeScript validation vs 3+ redundant checks
- **Shared resources**: Port detection, dev server health, screenshot generation
- **Optimized testing**: Context-aware test selection vs always running comprehensive suites
- **Improvement**: **60% reduction** in redundant operations

### Developer Experience

#### Reliable Workflow
- **No more timeout failures**: 100% hook execution success rate
- **Predictable performance**: Consistent execution times within SLA
- **Better feedback**: Real-time progress and clear completion status
- **Fast iteration**: Sub-30-second cycles for active development

#### Intelligent Automation
- **Context awareness**: Optimized workflows for /2 redesign vs main portfolio
- **Smart defaults**: Minimal configuration required
- **Manual overrides**: Comprehensive validation available when needed
- **Background processing**: Heavy operations don't block development

### System Reliability

#### Timeout Compliance
- **60-second adherence**: All operations sized for Claude timeout limit
- **Graceful handling**: Operations exceeding timeout moved to background
- **Cascade prevention**: Individual operation failures don't block entire workflow
- **Recovery mechanisms**: Automatic retry and fallback strategies

#### Resource Management
- **Conflict prevention**: Coordinated access to shared resources
- **Performance monitoring**: Real-time SLA tracking and optimization
- **Session management**: Persistent state across hook executions
- **Error isolation**: Failed operations don't impact independent processes

---

## Conclusion

The proposed Claude Hooks Orchestration System transforms the current problematic hook architecture into an intelligent, performant, and reliable development automation system. By replacing chaotic parallel execution with smart orchestration, the system will:

1. **Eliminate timeout failures** through intelligent operation sizing and 60-second compliance
2. **Improve development velocity** by 80% through optimized execution and eliminated redundancy  
3. **Maintain comprehensive quality gates** while providing fast feedback during active development
4. **Enable context-aware optimization** for different development workflows and project contexts
5. **Provide reliable automation** that enhances rather than hinders the development experience

The implementation roadmap provides a systematic approach to transitioning from the current system while preserving all existing functionality and quality standards. The result will be a world-class development automation system that showcases technical excellence while solving real performance problems.

**Next Step**: Implement Phase 1 (Orchestrator Foundation) to begin realizing these benefits immediately.