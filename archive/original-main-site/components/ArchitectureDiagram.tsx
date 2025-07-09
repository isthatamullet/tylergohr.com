"use client";

import { useState } from "react";
import { ArchitectureNode } from "@/lib/types";
import styles from "./ArchitectureDiagram.module.css";

interface ArchitectureDiagramProps {
  architecture: ArchitectureNode[];
}

export default function ArchitectureDiagram({
  architecture,
}: ArchitectureDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeIcon = (type: ArchitectureNode["type"]) => {
    switch (type) {
      case "frontend":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.nodeIcon}
          >
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" />
            <path d="M2 12L12 17L22 12" />
          </svg>
        );
      case "backend":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.nodeIcon}
          >
            <path d="M4 6H20V12H4V6Z" />
            <path d="M4 14H20V18H4V14Z" />
            <circle cx="6" cy="9" r="1" />
            <circle cx="6" cy="16" r="1" />
          </svg>
        );
      case "database":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.nodeIcon}
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5V19C3 20.1 7.03 21 12 21S21 20.1 21 19V5" />
            <path d="M3 12C3 13.1 7.03 14 12 14S21 13.1 21 12" />
          </svg>
        );
      case "external":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.nodeIcon}
          >
            <path d="M13 3C13 2.45 12.55 2 12 2S11 2.45 11 3V11H3C2.45 11 2 11.45 2 12S2.45 13 3 13H11V21C11 21.55 11.45 22 12 22S13 21.55 13 21V13H21C21.55 13 22 12.55 22 12S21.55 11 21 11H13V3Z" />
          </svg>
        );
      case "cloud":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.nodeIcon}
          >
            <path d="M6.5 20Q4.22 20 2.61 18.43Q1 16.85 1 14.58Q1 12.63 2.17 11.1Q3.35 9.57 5.25 9.15Q5.88 6.85 7.75 5.43Q9.63 4 12 4Q14.93 4 16.96 6.04Q19 8.07 19 11Q20.73 11.2 21.86 12.5Q23 13.78 23 15.5Q23 17.38 21.69 18.69Q20.38 20 18.5 20Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getNodeColor = (type: ArchitectureNode["type"]) => {
    switch (type) {
      case "frontend":
        return "var(--portfolio-interactive)";
      case "backend":
        return "var(--portfolio-accent-green)";
      case "database":
        return "var(--portfolio-accent-red)";
      case "external":
        return "#f59e0b";
      case "cloud":
        return "#8b5cf6";
      default:
        return "var(--portfolio-text-secondary)";
    }
  };

  // Helper function for checking connections (future use)
  // const isConnected = (nodeId: string, targetId: string) => {
  //   const node = architecture.find(n => n.id === nodeId)
  //   return node?.connections.includes(targetId) || false
  // }

  const getConnectionPath = (from: ArchitectureNode, to: ArchitectureNode) => {
    const fromX = from.position.x + 75; // Half of node width
    const fromY = from.position.y + 40; // Half of node height
    const toX = to.position.x + 75;
    const toY = to.position.y + 40;

    return `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2 - 30} ${toX} ${toY}`;
  };

  const selectedNodeData = selectedNode
    ? architecture.find((n) => n.id === selectedNode)
    : null;

  return (
    <div className={styles.architectureContainer}>
      <div className={styles.diagramWrapper}>
        <svg
          className={styles.diagram}
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection Lines */}
          <g className={styles.connections}>
            {architecture.map((node) =>
              node.connections.map((connectionId) => {
                const targetNode = architecture.find(
                  (n) => n.id === connectionId,
                );
                if (!targetNode) return null;

                return (
                  <path
                    key={`${node.id}-${connectionId}`}
                    d={getConnectionPath(node, targetNode)}
                    className={`${styles.connectionLine} ${
                      hoveredNode === node.id || hoveredNode === connectionId
                        ? styles.highlighted
                        : ""
                    }`}
                    stroke={getNodeColor(node.type)}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={node.type === "external" ? "5,5" : "none"}
                  />
                );
              }),
            )}
          </g>

          {/* Architecture Nodes */}
          <g className={styles.nodes}>
            {architecture.map((node) => (
              <g
                key={node.id}
                className={`${styles.nodeGroup} ${
                  selectedNode === node.id ? styles.selected : ""
                } ${hoveredNode === node.id ? styles.hovered : ""}`}
                transform={`translate(${node.position.x}, ${node.position.y})`}
                onClick={() =>
                  setSelectedNode(node.id === selectedNode ? null : node.id)
                }
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedNode(node.id === selectedNode ? null : node.id);
                  }
                }}
              >
                {/* Node Background */}
                <rect
                  className={styles.nodeBackground}
                  width="150"
                  height="80"
                  rx="12"
                  fill="rgba(255, 255, 255, 0.05)"
                  stroke={getNodeColor(node.type)}
                  strokeWidth="2"
                />

                {/* Node Icon */}
                <g
                  transform="translate(15, 15)"
                  style={{ color: getNodeColor(node.type) }}
                >
                  {getNodeIcon(node.type)}
                </g>

                {/* Node Label */}
                <text
                  className={styles.nodeLabel}
                  x="75"
                  y="45"
                  textAnchor="middle"
                  fill="var(--portfolio-text-primary)"
                >
                  {node.label}
                </text>

                {/* Node Type Badge */}
                <text
                  className={styles.nodeType}
                  x="75"
                  y="60"
                  textAnchor="middle"
                  fill={getNodeColor(node.type)}
                >
                  {node.type.toUpperCase()}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Legend */}
        <div className={styles.legend}>
          <h4 className={styles.legendTitle}>Component Types</h4>
          <div className={styles.legendItems}>
            {[
              { type: "frontend" as const, label: "Frontend" },
              { type: "backend" as const, label: "Backend" },
              { type: "database" as const, label: "Database" },
              { type: "external" as const, label: "External API" },
              { type: "cloud" as const, label: "Cloud Service" },
            ].map(({ type, label }) => (
              <div key={type} className={styles.legendItem}>
                <div
                  className={styles.legendColor}
                  style={{ backgroundColor: getNodeColor(type) }}
                />
                <span className={styles.legendLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNodeData && (
        <div className={`${styles.nodeDetails} scale-in-on-scroll`}>
          <header className={styles.detailsHeader}>
            <div
              className={styles.detailsIcon}
              style={{ color: getNodeColor(selectedNodeData.type) }}
            >
              {getNodeIcon(selectedNodeData.type)}
            </div>
            <div>
              <h3 className={styles.detailsTitle}>{selectedNodeData.label}</h3>
              <span
                className={styles.detailsType}
                style={{ color: getNodeColor(selectedNodeData.type) }}
              >
                {selectedNodeData.type.toUpperCase()}
              </span>
            </div>
            <button
              className={styles.closeDetails}
              onClick={() => setSelectedNode(null)}
              aria-label="Close details"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <div className={styles.detailsContent}>
            <p className={styles.detailsDescription}>
              {selectedNodeData.description}
            </p>

            <div className={styles.detailsTech}>
              <h4 className={styles.detailsTechTitle}>Technologies</h4>
              <div className={styles.techList}>
                {selectedNodeData.technologies.map((tech) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {selectedNodeData.connections.length > 0 && (
              <div className={styles.detailsConnections}>
                <h4 className={styles.detailsConnectionsTitle}>Connected To</h4>
                <div className={styles.connectionsList}>
                  {selectedNodeData.connections.map((connectionId) => {
                    const connectedNode = architecture.find(
                      (n) => n.id === connectionId,
                    );
                    return connectedNode ? (
                      <button
                        key={connectionId}
                        className={styles.connectionTag}
                        onClick={() => setSelectedNode(connectionId)}
                        style={{
                          borderColor: getNodeColor(connectedNode.type),
                        }}
                      >
                        {connectedNode.label}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
