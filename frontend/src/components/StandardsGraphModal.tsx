"use client";
import "@xyflow/react/dist/style.css";

import React, { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant,
  ReactFlowProvider
} from "@xyflow/react";
import {
  X,
  Network,
  BookOpen,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { GraphData, StandardMetadata } from "@/types";

interface StandardsGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  graphData: GraphData;
  onSelectStandardMetadata?: (std: StandardMetadata) => void;
}

// Custom Warm Node Component
const CustomStandardNode = ({ data }: NodeProps) => {
  const isPrimary = Boolean(data.is_primary);
  const nodeType = (data.type as string) || "related";

  const getNodeStyles = () => {
    if (isPrimary) {
      return "border-[#FC6C26] bg-gradient-to-b from-[#FC6C26] to-[#D95218] text-white shadow-lg shadow-[#D95218]/40 ring-2 ring-[#FC6C26]/40";
    }
    switch (nodeType) {
      case "normative":
        return "border-[#E7D9BC] bg-[#FFF8E9] text-[#231A14] hover:border-[#FC6C26]";
      case "testing":
        return "border-emerald-500/40 bg-emerald-50 text-emerald-950 hover:border-emerald-600";
      case "safety":
        return "border-rose-500/40 bg-rose-50 text-rose-950 hover:border-rose-600";
      case "installation":
        return "border-amber-500/40 bg-amber-50 text-amber-950 hover:border-amber-600";
      default:
        return "border-[#E7D9BC] bg-[#FFFAEF] text-[#231A14] hover:border-[#FC6C26]";
    }
  };

  return (
    <div
      className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all min-w-[130px] max-w-[200px] text-center shadow-xs ${getNodeStyles()}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-[#FC6C26] !w-2 !h-2 !border !border-white"
      />
      <div className="space-y-0.5">
        <div className="text-[11px] font-black truncate">{String(data.label || "")}</div>
        {Boolean(data.title) && (
          <div className="text-[9px] font-sans font-medium line-clamp-1 opacity-80">
            {String(data.title)}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[#FC6C26] !w-2 !h-2 !border !border-white"
      />
    </div>
  );
};

const nodeTypes = {
  standardNode: CustomStandardNode,
};

export const StandardsGraphModal: React.FC<StandardsGraphModalProps> = ({
  isOpen,
  onClose,
  graphData,
  onSelectStandardMetadata,
}) => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Layout nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    if (!graphData || !graphData.nodes) return [];

    return graphData.nodes.map((n) => {
      const isPrimary = Boolean(n.data?.is_primary ?? (n as any).is_primary);

      return {
        id: n.id,
        type: "standardNode",
        position: n.position || { x: 400, y: 250 },
        data: {
          label: n.data?.is_number || (n as any).label || n.id,
          title: n.data?.title || (n as any).title,
          is_primary: isPrimary,
          type: n.type,
          domain: n.data?.domain || (n as any).domain,
          scope: n.data?.scope || (n as any).scope,
        },
      };
    });
  }, [graphData]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!graphData || !graphData.edges) return [];
    return graphData.edges.map((e, idx) => ({
      id: `e_${e.source}_${e.target}_${idx}`,
      source: e.source,
      target: e.target,
      label: e.label || (e as any).relation,
      animated: true,
      style: {
        stroke: "#FC6C26",
        strokeWidth: 1.5,
        opacity: 0.6,
      },
      labelStyle: {
        fontSize: 9,
        fontWeight: 600,
        fill: "#E7D9BC",
        fontFamily: "JetBrains Mono, monospace",
      },
    }));
  }, [graphData]);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Sync state when graphData updates
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node.data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50 duration-150">
      <div className="relative w-full max-w-6xl h-[88vh] rounded-3xl bg-[#241C15] border border-[#E7D9BC]/30 shadow-2xl flex flex-col overflow-hidden text-[#FFF8E9]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-[#E7D9BC]/20 bg-[#2A211A] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FC6C26]/20 border border-[#FC6C26]/40 flex items-center justify-center text-[#FC6C26]">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                Standards Relationship DAG & Knowledge Network
              </h2>
              <p className="text-[11px] text-[#E7D9BC]/70 font-medium">
                Interactive citation dependencies, normative references, and test methodologies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[#E7D9BC]/20 bg-white/5 text-[#E7D9BC] hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Canvas + Slide-out Inspector Drawer */}
        <div className="relative flex-1 w-full h-full overflow-hidden" style={{ minHeight: "500px" }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={2}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="rgba(252, 108, 38, 0.15)"
              />
              <Controls className="!bg-[#2A211A] !border-[#E7D9BC]/20 !fill-white" />
            </ReactFlow>
          </ReactFlowProvider>

          {/* Node Category Legend Overlay */}
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-[#2A211A]/90 backdrop-blur-md border border-[#E7D9BC]/20 text-[11px] font-mono space-y-1.5 pointer-events-none">
            <div className="text-[10px] uppercase font-bold text-[#E7D9BC]/60">Legend:</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FC6C26]" />
              <span className="text-white">Primary Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFF8E9]" />
              <span className="text-[#E7D9BC]">Normative Reference</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300">Test Method</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-rose-300">Safety Code</span>
            </div>
          </div>

          {/* Slide-out Inspector Drawer */}
          {selectedNode && (
            <div className="absolute top-4 right-4 w-80 max-h-[80%] rounded-2xl bg-[#2A211A]/95 backdrop-blur-xl border border-[#E7D9BC]/30 p-4 shadow-2xl space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]/20">
                <span className="font-mono text-xs font-bold text-[#FC6C26]">
                  {selectedNode.label}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="text-[#E7D9BC]/60 hover:text-white transition p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-white">
                  {selectedNode.title || "Indian Standard Specification"}
                </div>
                {selectedNode.domain && (
                  <div className="text-[10px] text-[#E7D9BC]/70 font-mono">
                    Domain: {selectedNode.domain}
                  </div>
                )}
                {selectedNode.scope && (
                  <p className="text-[11px] text-[#E7D9BC]/80 leading-relaxed pt-1">
                    {selectedNode.scope}
                  </p>
                )}
              </div>

              {onSelectStandardMetadata && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectStandardMetadata({
                      id: selectedNode.label,
                      is_number: selectedNode.label,
                      title: selectedNode.title || "",
                      domain: selectedNode.domain || "General",
                      year: 2018,
                      status: "current",
                      scope: selectedNode.scope || "",
                    } as unknown as StandardMetadata);
                  }}
                  className="w-full tactile-btn-primary py-1.5 text-xs font-bold rounded-lg"
                >
                  <span>Open Full Specifications</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
