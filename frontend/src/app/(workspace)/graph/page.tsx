"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
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
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Network,
  ExternalLink,
  Shield,
  Sparkles,
  Layers,
  ChevronRight,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Zap,
  Info,
  X
} from "lucide-react";
import { fetchStandards, fetchStandardDetail } from "@/lib/api";
import { StandardMetadata } from "@/types";
import { StandardDetailDrawer } from "@/components/StandardDetailDrawer";
import { StatusPill } from "@/components/ui/StatusBadge";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

// Custom Node for React Flow with Warm Liquid Glass styling & categories
const CustomStandardNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const isPrimary = data.is_primary;
  const status = data.status || "current";
  const category = data.category || "Standard";

  const getCategoryStyles = () => {
    if (isPrimary) {
      return "border-[#FC6C26] bg-gradient-to-br from-[#FC6C26] to-[#D95218] text-white shadow-xl shadow-[#D95218]/30 ring-2 ring-[#FC6C26]";
    }
    switch (category) {
      case "Normative Reference":
        return "border-[#E7D9BC] bg-[#FFFAF2] text-[#231A14] hover:border-[#FC6C26] shadow-sm";
      case "Testing Standard":
        return "border-emerald-500/40 bg-emerald-50/90 text-emerald-950 hover:border-emerald-600 shadow-sm";
      case "Safety Standard":
        return "border-rose-500/40 bg-rose-50/90 text-rose-950 hover:border-rose-600 shadow-sm";
      case "Installation Standard":
        return "border-amber-500/40 bg-amber-50/90 text-amber-950 hover:border-amber-600 shadow-sm";
      default:
        return "border-[#E7D9BC] bg-white text-[#231A14] hover:border-[#FC6C26] shadow-sm";
    }
  };

  const getBadgeColor = () => {
    if (isPrimary) return "bg-white/20 text-white font-bold backdrop-blur-xs";
    if (category === "Safety Standard") return "bg-rose-500/15 text-rose-800 border border-rose-300";
    if (category === "Testing Standard") return "bg-emerald-500/15 text-emerald-800 border border-emerald-300";
    if (category === "Installation Standard") return "bg-amber-500/15 text-amber-900 border border-amber-300";
    return "bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30";
  };

  return (
    <div
      className={`px-4 py-3 rounded-2xl border transition-all text-left w-64 ${getCategoryStyles()} ${
        selected ? "ring-4 ring-[#FC6C26]/40 scale-102" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-[#FC6C26] !w-2.5 !h-2.5 !border !border-white"
      />

      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span
          className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getBadgeColor()}`}
        >
          {category}
        </span>

        <span
          className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
            isPrimary
              ? "bg-white/20 text-white border-white/30"
              : status === "current"
              ? "bg-emerald-500/10 text-emerald-800 border-emerald-300"
              : "bg-rose-500/10 text-rose-800 border-rose-300"
          }`}
        >
          {status === "current" ? "Active" : "Superseded"}
        </span>
      </div>

      <div className="font-mono text-xs font-bold truncate">
        {data.is_number}
      </div>

      <div className="text-[10px] line-clamp-2 mt-0.5 font-medium leading-snug opacity-90">
        {data.title}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[#FC6C26] !w-2.5 !h-2.5 !border !border-white"
      />
    </div>
  );
};

function GraphCanvasInner() {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const [standards, setStandards] = useState<StandardMetadata[]>([]);
  const [selectedStandardId, setSelectedStandardId] = useState<string>("IS 12615:2018");
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerStandard, setDrawerStandard] = useState<StandardMetadata | null>(null);
  const [allGraphNodes, setAllGraphNodes] = useState<Node[]>([]);
  const [allGraphEdges, setAllGraphEdges] = useState<Edge[]>([]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = useMemo(() => ({ custom: CustomStandardNode }), []);

  useEffect(() => {
    Promise.all([
      fetchStandards().then((stds) => setStandards(stds)),
      loadGraphForStandard("IS 12615:2018"),
    ]).catch(() => setIsLoading(false));
  }, []);

  const loadGraphForStandard = async (stdId: string) => {
    setIsLoading(true);
    setSelectedStandardId(stdId);
    try {
      const data = await fetchStandardDetail(stdId);
      if (data && data.graph_data) {
        const flowNodes: Node[] = (data.graph_data.nodes || []).map((n: any) => ({
          id: n.id,
          type: "custom",
          position: n.position || { x: 400, y: 100 },
          data: n.data,
        }));

        const flowEdges: Edge[] = (data.graph_data.edges || []).map((e: any) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          animated: e.animated,
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: "#FC6C26" },
          style: { stroke: "#FC6C26", strokeWidth: 1.5, opacity: 0.65 },
        }));

        setAllGraphNodes(flowNodes);
        setAllGraphEdges(flowEdges);
        setNodes(flowNodes);
        setEdges(flowEdges);
      }
    } catch (e) {
      console.error("Failed to load graph for standard", e);
    } finally {
      setIsLoading(false);
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    }
  };

  // Filter nodes based on category and search query
  useEffect(() => {
    let filtered = allGraphNodes;
    if (activeCategoryFilter !== "all") {
      filtered = filtered.filter((n) => {
        if (activeCategoryFilter === "primary") return n.data?.is_primary;
        if (activeCategoryFilter === "normative") return n.data?.category === "Normative Reference";
        if (activeCategoryFilter === "testing") return n.data?.category === "Testing Standard";
        if (activeCategoryFilter === "safety") return n.data?.category === "Safety Standard";
        if (activeCategoryFilter === "installation") return n.data?.category === "Installation Standard";
        return true;
      });
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((n) => {
        const d = n.data as any;
        return (
          d?.is_number?.toLowerCase()?.includes(q) ||
          d?.title?.toLowerCase()?.includes(q)
        );
      });
    }

    setNodes(filtered);
  }, [activeCategoryFilter, searchQuery, allGraphNodes]);

  const handleNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeData(node.data);
  }, []);

  const handleOpenDetailDrawer = (nodeData: any) => {
    const meta: StandardMetadata = {
      id: nodeData.is_number || "IS-GEN",
      is_number: nodeData.is_number || "IS 12615:2018",
      title: nodeData.title || "Standard Specification",
      domain: nodeData.domain || "Electrical Engineering",
      year: nodeData.year || 2024,
      status: nodeData.status || "current",
      technical_parameters: {},
      scope: nodeData.scope || "Specification requirements under Bureau of Indian Standards catalog.",
      supersedes: [],
      amendments: [],
      normative_references: [],
      test_methods: [],
      safety_standards: [],
      installation_standards: [],
      related_standards: [],
      certification: [],
      keywords: [],
      ai_relevance_score: 92,
    };
    setDrawerStandard(meta);
    setIsDrawerOpen(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-120px)] flex flex-col rounded-3xl overflow-hidden border border-[#E7D9BC] shadow-xl bg-[#241C15]">
      {/* Floating Graph Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Focus Selector & Search */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#FFFCF4]/90 backdrop-blur-md p-2 rounded-2xl border border-[#E7D9BC] shadow-md">
          <div className="flex items-center gap-1.5 px-2">
            <Network className="w-4 h-4 text-[#FC6C26]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14] hidden sm:inline">
              Focus:
            </span>
          </div>
          <select
            value={selectedStandardId}
            onChange={(e) => loadGraphForStandard(e.target.value)}
            className="p-2 rounded-xl bg-white border border-[#E7D9BC] text-xs font-semibold text-[#231A14] focus:outline-none focus:border-[#FC6C26] cursor-pointer max-w-[210px] sm:max-w-xs"
          >
            {standards.map((s) => (
              <option key={s.id} value={s.is_number}>
                {s.is_number} : {s.title.slice(0, 30)}
              </option>
            ))}
          </select>

          {/* Quick Search */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-[#8D7B68] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#E7D9BC] text-xs focus:outline-none focus:border-[#FC6C26] w-36"
            />
          </div>
        </div>

        {/* Center: Category Filter Chips */}
        <div className="hidden lg:flex items-center gap-1 pointer-events-auto bg-[#FFFCF4]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#E7D9BC] shadow-md">
          {[
            { id: "all", label: "All Nodes" },
            { id: "primary", label: "Primary" },
            { id: "normative", label: "Normative" },
            { id: "testing", label: "Testing" },
            { id: "safety", label: "Safety" },
            { id: "installation", label: "Installation" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? "bg-[#FC6C26] text-white font-bold shadow-xs"
                  : "bg-white text-[#5D4E42] hover:bg-[#FFF4E0]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right: Viewport Controls */}
        <div className="flex items-center gap-1 pointer-events-auto bg-[#FFFCF4]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#E7D9BC] shadow-md">
          <button
            onClick={() => zoomIn()}
            className="p-2 rounded-xl bg-white border border-[#E7D9BC] text-[#231A14] hover:bg-[#FFF4E0] transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => zoomOut()}
            className="p-2 rounded-xl bg-white border border-[#E7D9BC] text-[#231A14] hover:bg-[#FFF4E0] transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => fitView({ padding: 0.2 })}
            className="p-2 rounded-xl bg-[#FC6C26] text-white font-bold hover:bg-[#D95218] transition cursor-pointer flex items-center gap-1 text-xs"
            title="Fit View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit View</span>
          </button>
        </div>
      </div>

      {/* Floating Graph Legend */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
        <div className="pointer-events-auto bg-[#FFFCF4]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E7D9BC] shadow-md flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FC6C26]" />
            <span className="text-[#231A14] text-[11px] font-semibold">Primary Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFFAEF] border border-[#E7D9BC]" />
            <span className="text-[#5D4E42] text-[11px] font-medium">Normative</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#5D4E42] text-[11px] font-medium">Testing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-[#5D4E42] text-[11px] font-medium">Safety</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[#5D4E42] text-[11px] font-medium">Installation</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 w-full h-full relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-xs font-mono text-[#E7D9BC] gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FC6C26] animate-ping" />
            <span>Traversing Directed Acyclic Graph (DAG) connections...</span>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Background color="rgba(252, 108, 38, 0.18)" gap={24} size={1} />
            <MiniMap
              position="bottom-right"
              nodeStrokeColor="rgba(255,255,255,0.4)"
              nodeColor="#FC6C26"
              maskColor="rgba(36, 28, 21, 0.85)"
              className="!border !border-[#E7D9BC]/30 !rounded-2xl !bg-[#2A211A] !m-4"
            />
          </ReactFlow>
        )}

        {/* Floating Selected Node Inspector Card */}
        {selectedNodeData && (
          <div className="absolute top-20 right-4 z-20 w-80 bg-[#FFFCF4]/95 backdrop-blur-md border border-[#E7D9BC] rounded-3xl p-5 shadow-2xl space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30">
                {selectedNodeData.category || "Standard"}
              </span>
              <button
                onClick={() => setSelectedNodeData(null)}
                className="p-1 rounded-lg text-[#8D7B68] hover:text-[#231A14] hover:bg-[#EFE3CF] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-mono text-base font-bold text-[#231A14]">
                {selectedNodeData.is_number}
              </h3>
              <h4 className="text-xs font-semibold text-[#231A14] mt-0.5 leading-snug line-clamp-2">
                {selectedNodeData.title}
              </h4>
              <div className="text-[11px] text-[#8D7B68] font-mono mt-1">
                {selectedNodeData.domain} • Year {selectedNodeData.year}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E7D9BC] text-xs space-y-1">
              <span className="font-mono text-[#D95218] text-[10px] uppercase font-bold block">
                Technical Scope:
              </span>
              <p className="text-[#5D4E42] text-[11px] leading-relaxed line-clamp-3">
                {selectedNodeData.scope || "Specification requirements under Bureau of Indian Standards catalog."}
              </p>
            </div>

            <div className="pt-1 flex gap-2">
              <PrimaryButton
                size="sm"
                onClick={() => handleOpenDetailDrawer(selectedNodeData)}
                className="w-full text-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Full Specification</span>
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>

      {/* Slide-In Standard Detail Drawer */}
      <StandardDetailDrawer
        standard={drawerStandard}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerStandard(null);
        }}
      />
    </div>
  );
}

// Lazy-load the heavy ReactFlow canvas — the @xyflow/react bundle is ~150KB+
// and should only be downloaded when the user actually visits /graph.
import dynamic from "next/dynamic";

const LazyGraphCanvas = dynamic(
  () =>
    Promise.resolve(function LazyCanvas() {
      return (
        <ReactFlowProvider>
          <GraphCanvasInner />
        </ReactFlowProvider>
      );
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] rounded-3xl border border-[#E7D9BC] bg-[#241C15]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#E7D9BC]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FC6C26] animate-ping" />
          <span>Loading Knowledge Graph canvas...</span>
        </div>
      </div>
    ),
  }
);

export default function KnowledgeGraphPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Immersive Dedicated Canvas Workspace */}
      <LazyGraphCanvas />
    </main>
  );
}
