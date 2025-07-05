# Tyler Gohr Portfolio - Advanced Port Management Strategy

## Executive Summary

This document outlines a comprehensive port management strategy for Tyler's development environment that prevents multi-server conflicts, provides intelligent cleanup, and integrates seamlessly with the existing Claude Code hooks system.

## Problem Statement

Tyler's development environment was experiencing timeout issues due to:
- Multiple Next.js development servers running simultaneously
- Unresponsive or hung servers consuming ports
- Lack of intelligent port selection and cleanup
- Manual intervention required for server management

## Solution Architecture

### 1. Port Manager System (`scripts/port-manager.sh`)

**Core Capabilities:**
- **Discovery**: Identifies all Next.js servers using process-based and network-based detection
- **Health Assessment**: Tests server responsiveness with configurable timeouts
- **Intelligent Cleanup**: Removes unhealthy servers with graceful shutdown
- **Smart Selection**: Chooses optimal port based on performance metrics
- **Consolidation**: Maintains single optimal server for development

**Key Features:**
- IPv4 and IPv6 support
- Cloud environment awareness
- Graceful and forced cleanup mechanisms
- Performance-based port selection
- Comprehensive logging and reporting

### 2. Testing Framework (`scripts/test-port-scenarios.sh`)

**Test Coverage:**
- Single server management
- Multiple server consolidation
- Timeout and unresponsive server handling
- Dead process cleanup
- Stress and resilience testing
- Cloud environment compatibility
- Network recovery scenarios
- Performance benchmarking

### 3. Integration Points

**Hooks System Integration:**
- Provides detailed server information to hooks
- Caches optimal port selection
- Supports operation context tracking
- Generates JSON reports for programmatic use

**Cloud Environment Support:**
- Google Cloud Workstations
- GitHub Codespaces
- Gitpod
- Local development

## Implementation Details

### Discovery Algorithm

```bash
# Phase 1: Process-based discovery
1. Find all Next.js processes (next-server, next dev)
2. For each process, check port usage via fuser
3. Validate process health and port binding

# Phase 2: Network-based discovery
1. Scan active ports in range (3000-4010)
2. Identify orphaned ports without known processes
3. Cross-reference with process information
```

### Health Assessment Matrix

| Response Code | Classification | Action |
|---------------|---------------|---------|
| 200, 302, 304 | Healthy | Keep running |
| Timeout | Unhealthy | Mark for cleanup |
| 000 (Connection failed) | Unresponsive | Mark for cleanup |
| Other codes | Error | Mark for cleanup |

### Cleanup Strategy

```bash
# Graceful cleanup sequence
1. Send SIGTERM to process
2. Wait up to 5 seconds for graceful shutdown
3. Force kill with SIGKILL if needed
4. Verify process termination
5. Update server registry
```

### Smart Port Selection

```bash
# Selection criteria (in order of priority)
1. Server health (must be healthy)
2. Response time (fastest response)
3. Port number (prefer lower numbers)
4. Process age (prefer newer processes)
```

## Usage Patterns

### For Daily Development

```bash
# Quick health check and optimization
./scripts/port-manager.sh full-cycle

# Just discover current state
./scripts/port-manager.sh discover

# Clean up unhealthy servers
./scripts/port-manager.sh cleanup
```

### For Hooks Integration

```bash
# Get optimal port for hook operations
eval "$(./scripts/port-manager.sh select)"
echo "Using port: $ACTIVE_DEV_PORT"
echo "Using URL: $ACTIVE_DEV_URL"

# Generate report for hook context
REPORT_FILE=$(./scripts/port-manager.sh report)
# Parse JSON report for hook decisions
```

### For Troubleshooting

```bash
# Create complex test scenario
./scripts/create-test-scenario.sh

# Run comprehensive tests
./scripts/test-port-scenarios.sh all

# Stress test the system
./scripts/port-manager.sh stress-test
```

## Performance Metrics

**Benchmarking Results:**
- Discovery: ~2-3 seconds for full scan
- Health assessment: ~1-2 seconds per server
- Cleanup: ~1-3 seconds per server (graceful)
- Full cycle: ~5-10 seconds for typical scenarios

**Optimization Targets:**
- <30 seconds for 10 discovery cycles
- <10 seconds for full management cycle
- <5 seconds for health assessment
- <3 seconds for single server cleanup

## Resilience Features

### Timeout Handling
- Configurable health check timeouts
- Graceful degradation for slow networks
- Retry mechanisms for transient failures

### Process Management
- Dead process detection and cleanup
- Orphaned port identification
- Resource leak prevention

### Error Recovery
- Automatic fallback to network scanning
- Multiple discovery methods
- Comprehensive error logging

### Lock Management
- Prevents concurrent port manager operations
- Automatic lock cleanup on exit
- Configurable lock timeout

## Integration with Existing Infrastructure

### Claude Code Hooks
```bash
# Hook integration points
1. Pre-tool validation: Check port availability
2. Post-tool optimization: Cleanup and consolidate
3. Context detection: Identify optimal configuration
4. Performance monitoring: Track server health
```

### Cloud Environment Detection
```bash
# Automatic environment detection
- Google Cloud Workstations: Custom preview URLs
- GitHub Codespaces: Preview app URLs
- Gitpod: Workspace URLs
- Local development: localhost URLs
```

### Caching Strategy
```bash
# Cache locations and TTL
~/.claude/hooks/active-port.cache (30 min TTL)
~/.claude/hooks/optimal-port.cache (30 min TTL)
/tmp/port-manager-report.json (session-based)
```

## Monitoring and Observability

### Logging Levels
- **INFO**: Normal operations and discovery
- **SUCCESS**: Successful operations and health checks
- **WARNING**: Degraded performance or orphaned resources
- **ERROR**: Critical failures requiring attention

### Report Generation
```json
{
  "timestamp": "2025-07-05T09:45:00Z",
  "environment": "google-cloud-workstations",
  "scan_summary": {
    "total_servers": 3,
    "healthy_servers": 1,
    "unhealthy_servers": 2
  },
  "servers": [
    {
      "port": 3000,
      "pid": 253965,
      "health": "healthy",
      "response_time": 1,
      "url": "https://3000-tylergohr.cluster-cbx7armcmnaqcxcx5fojjql2bo.cloudworkstations.dev/"
    }
  ],
  "optimal_port": 3000,
  "optimal_url": "https://3000-tylergohr.cluster-cbx7armcmnaqcxcx5fojjql2bo.cloudworkstations.dev/"
}
```

## Security Considerations

### Process Safety
- Validates process ownership before cleanup
- Uses PID verification for process operations
- Implements graceful shutdown sequences

### Port Safety
- Validates port ranges for development use
- Prevents system port interference
- Implements connection timeout limits

### Resource Protection
- Implements lock mechanisms for concurrent access
- Provides cleanup on abnormal termination
- Tracks resource usage and cleanup

## Maintenance and Operations

### Regular Maintenance
```bash
# Weekly: Clean up old cache files
find ~/.claude/hooks -name "*.cache" -mtime +7 -delete

# Monthly: Review performance metrics
./scripts/test-port-scenarios.sh benchmark

# As needed: Update configuration
vim scripts/port-manager.sh # Adjust PORT_RANGE_* constants
```

### Configuration Management
```bash
# Key configuration parameters
PORT_RANGE_START=3000           # Start of port scanning range
PORT_RANGE_END=4010             # End of port scanning range
MAX_CONCURRENT_SERVERS=1        # Optimal server count
HEALTH_CHECK_TIMEOUT=10         # Health check timeout
CLEANUP_GRACE_PERIOD=5          # Graceful shutdown timeout
```

### Troubleshooting Guide

**Common Issues:**
1. **No servers discovered**: Check if development server is running
2. **Timeout errors**: Increase HEALTH_CHECK_TIMEOUT
3. **Permission denied**: Ensure proper user permissions for process operations
4. **Lock conflicts**: Remove `/tmp/port-manager.lock` if stale

**Diagnostic Commands:**
```bash
# Check current port usage
netstat -tuln | grep :3000

# Check process information
ps aux | grep -E "next-server|next dev"

# Test port responsiveness
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# Generate diagnostic report
./scripts/port-manager.sh report
```

## Future Enhancements

### Phase 1 (Immediate)
- [ ] Integration with npm scripts for automatic management
- [ ] Enhanced cloud environment detection
- [ ] Improved error messages and user guidance

### Phase 2 (Near-term)
- [ ] Web-based dashboard for port management
- [ ] Automated testing in CI/CD pipeline
- [ ] Performance monitoring and alerting

### Phase 3 (Long-term)
- [ ] Multi-project port management
- [ ] Docker container integration
- [ ] Advanced load balancing for development

## Conclusion

This port management strategy provides Tyler with:
- **Reliability**: Prevents timeout issues and server conflicts
- **Efficiency**: Intelligent cleanup and optimization
- **Observability**: Comprehensive monitoring and reporting  
- **Flexibility**: Supports multiple environments and workflows
- **Maintainability**: Clear architecture and testing framework

The system is designed to integrate seamlessly with Tyler's existing Claude Code hooks while providing standalone functionality for direct use. The comprehensive testing framework ensures reliability and provides a foundation for future enhancements.

## Quick Reference

### Essential Commands
```bash
# Complete management cycle
./scripts/port-manager.sh full-cycle

# Quick health check
./scripts/port-manager.sh assess

# Emergency cleanup
./scripts/port-manager.sh cleanup

# Get optimal port for scripts
eval "$(./scripts/port-manager.sh select)"

# Run comprehensive tests
./scripts/test-port-scenarios.sh all
```

### Key Files
- `scripts/port-manager.sh` - Main port management system
- `scripts/test-port-scenarios.sh` - Comprehensive testing framework
- `scripts/detect-active-port.sh` - Cloud-aware port detection
- `scripts/hooks/lib/port-detection-utils.sh` - Hook integration utilities
- `docs/port-management-strategy.md` - This strategy document