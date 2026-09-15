"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import { X, Network, Star, ExternalLink, ShieldAlert, Award, FileText, CheckCircle2 } from "lucide-react";
import { GraphData, StandardMetadata } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  graphData: GraphData;
  onSelectStandardMetadata: (std: StandardMetadata) => void;
}

// Custom Node for React Flow
const CustomStandardNode = ({ data }: { data: any }) => {
  const isPrimary = data.is_primary;
  const status = data.status || "current";
  const category = data.category || "Standard";

  const categoryColor =
    category === "Primary Standard"
      ? "border-blue-600 bg-blue-50/90"
      : category === "Normative Reference"
      ? "border-blue-400 bg-white hover:bg-blue-50/40"
      : category === "Testing Standard"
      ? "border-emerald-500 bg-white hover:bg-emerald-50/40"
      : category === "Safety Standard"
      ? "border-red-400 bg-white hover:bg-red-50/40"
      : category === "Installation Standard"
      ? "border-amber-400 bg-white hover:bg-amber-50/40"
      : "border-slate-300 bg-white hover:bg-slate-50";

  return (
    <div
      className={`px-3.5 py-2.5 rounded-xl shadow-md border-2 w-56 transition-all text-left ${categoryColor}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-600 !w-2 !h-2" />

      <div className="flex items-center justify-between gap-1 mb-1">
        <span
          className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
            isPrimary
              ? "bg-blue-700 text-white"
              : category === "Safety Standard"
              ? "bg-red-100 text-red-800"
              : category === "Testing Standard"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {category}
        </span>

        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
            status === "current"
              ? "text-emerald-700 bg-emerald-50"
              : "text-red-700 bg-red-50"
          }`}
        >
          {status === "current" ? "Active" : "Superseded"}
        </span>
      </div>

      <div className="font-mono text-xs font-black text-slate-900 truncate">
        {data.is_number}
      </div>

      <div className="text-[10px] text-slate-600 line-clamp-2 mt-0.5 font-medium">
        {data.title}
      </div>

      {isPrimary && data.ai_relevance_score && (
        <div className="mt-1.5 text-[10px] font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded text-center">
          AI Relevance: {data.ai_relevance_score}%
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-blue-600 !w-2 !h-2" />
    </div>
  );
};

export const StandardsGraphModal: React.FC<Props> = ({
  isOpen,
  onClose,
  graphData,
  onSelectStandardMetadata,
}) => {
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);

  const nodeTypes = useMemo(() => ({ custom: CustomStandardNode }), []);

  // Format nodes for React Flow
  const initialNodes: Node[] = useMemo(() => {
    return (graphData.nodes || []).map((n) => ({
      id: n.id,
      position: n.position,
      data: n.data,
      type: "custom",
    }));
  }, [graphData.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    return (graphData.edges || []).map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: e.animated,
      style: e.style,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 14,
        height: 14,
        color: e.style?.stroke || "#3b82f6",
      },
    }));
  }, [graphData.edges]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeData(node.data);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 md:p-6 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in-50 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Network className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Standards Relationship Graph (React Flow)
              </h3>
              <p className="text-xs text-slate-500">
                Visual relationship hierarchy showing normative references, test methods, safety, and superseded editions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Graph Body + Interactive Node Inspector */}
        <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
          {/* React Flow Canvas */}
          <div className="flex-1 h-full w-full relative bg-slate-50/50">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              fitViewOptions={{ padding: 0.2 }}
            >
              <MiniMap
                nodeColor={(n: any) =>
                  n.data?.is_primary
                    ? "#1d4ed8"
                    : n.data?.category === "Safety Standard"
                    ? "#ef4444"
                    : n.data?.category === "Testing Standard"
                    ? "#10b981"
                    : "#64748b"
                }
                className="!bottom-4 !right-4 !bg-white/90 !border !border-slate-200 !rounded-lg"
              />
              <Controls className="!bottom-4 !left-4 !bg-white !border !border-slate-200 !shadow-sm !rounded-lg" />
              <Background gap={18} size={1} color="#cbd5e1" />
            </ReactFlow>

            {/* Instruction pill */}
            <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs text-[11px] text-slate-600 font-medium">
              💡 Click any standard node to inspect full metadata & scope
            </div>

            {/* Permanent Relationship Legend */}
            <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-sm text-[10px] space-y-1 hidden sm:block max-w-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[9px] mb-1">
                Relationship Legend
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                  <span className="text-slate-700">Normative (Mandatory)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-slate-700">Testing Standard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                  <span className="text-slate-700">Safety Standard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="text-slate-700">Installation Code</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                  <span className="text-slate-700">Related Product</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="text-slate-700">Superseded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector Drawer (if node clicked) */}
          {selectedNodeData && (
            <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-5 overflow-y-auto shrink-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {selectedNodeData.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedNodeData(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>

                <div className="font-mono text-base font-black text-slate-900">
                  {selectedNodeData.is_number}
                </div>

                <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                  {selectedNodeData.title}
                </div>

                {/* Corpus Status Badge */}
                <div className="mt-2.5">
                  {selectedNodeData.is_in_corpus === false ? (
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900">
                      <strong>Referenced standard not included in prototype corpus</strong>
                      <p className="mt-0.5 text-amber-800">
                        This standard is cited in the technical specifications. The full 20,000+ BIS catalog is not fully loaded in this MVP prototype.
                      </p>
                    </div>
                  ) : (
                    <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ In Prototype Catalog (113 Standards)
                    </span>
                  )}
                </div>

                {/* Scope */}
                <div className="mt-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Standard Scope
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-mono">
                    {selectedNodeData.scope}
                  </p>
                </div>

                {selectedNodeData.certification && selectedNodeData.certification.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Quality Certification:
                    </span>
                    <div className="text-xs text-indigo-900 bg-indigo-50 p-2 rounded border border-indigo-200 font-medium">
                      {selectedNodeData.certification[0]}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onSelectStandardMetadata(selectedNodeData);
                    onClose();
                  }}
                  className="w-full text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 py-2 rounded-lg transition"
                >
                  View Full Standard Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
