// Tyler Gohr Portfolio - Health Check Endpoint
// Cloud Run health monitoring and container readiness validation

import { NextResponse } from "next/server";

// Health check response interface
interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    server: "ok" | "error";
    memory: "ok" | "warning" | "error";
    database?: "ok" | "error"; // Future use if database is added
  };
  metadata: {
    nodeVersion: string;
    platform: string;
    pid: number;
    memoryUsage: NodeJS.MemoryUsage;
  };
}

// Memory usage thresholds (in MB)
const MEMORY_WARNING_THRESHOLD = 400; // 400MB
const MEMORY_ERROR_THRESHOLD = 900; // 900MB

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  try {
    const startTime = Date.now();

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;

    let memoryStatus: "ok" | "warning" | "error" = "ok";
    if (heapUsedMB > MEMORY_ERROR_THRESHOLD) {
      memoryStatus = "error";
    } else if (heapUsedMB > MEMORY_WARNING_THRESHOLD) {
      memoryStatus = "warning";
    }

    // Calculate uptime in seconds
    const uptime = Math.floor(process.uptime());

    // Build health check response
    const healthCheck: HealthCheckResponse = {
      status: memoryStatus === "error" ? "unhealthy" : "healthy",
      timestamp: new Date().toISOString(),
      uptime,
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks: {
        server: "ok",
        memory: memoryStatus,
      },
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        pid: process.pid,
        memoryUsage,
      },
    };

    // Set appropriate status code
    const statusCode = healthCheck.status === "healthy" ? 200 : 503;

    // Add response headers for monitoring
    const response = NextResponse.json(healthCheck, { status: statusCode });

    // Cache control headers
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    // Response time header
    response.headers.set("X-Response-Time", `${Date.now() - startTime}ms`);

    return response;
  } catch (error) {
    // Handle any errors in health check
    console.error("Health check failed:", error);

    const errorResponse: HealthCheckResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks: {
        server: "error",
        memory: "error",
      },
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        pid: process.pid,
        memoryUsage: process.memoryUsage(),
      },
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}

// HEAD request for simple health checks (used by load balancers)
export async function HEAD(): Promise<NextResponse> {
  try {
    // Quick health check without body
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;

    const isHealthy = heapUsedMB < MEMORY_ERROR_THRESHOLD;
    const statusCode = isHealthy ? 200 : 503;

    const response = new NextResponse(null, { status: statusCode });
    response.headers.set("Cache-Control", "no-cache");

    return response;
  } catch (error) {
    console.error("Health check HEAD failed:", error);
    return new NextResponse(null, { status: 503 });
  }
}
