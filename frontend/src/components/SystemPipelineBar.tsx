"use client";

import React from "react";
import { AnalysisPipeline, AnalysisPipelineProps, PIPELINE_STAGES } from "./AnalysisPipeline";

export { AnalysisPipeline, PIPELINE_STAGES };
export type { AnalysisPipelineProps };

export const SystemPipelineBar: React.FC<AnalysisPipelineProps> = (props) => {
  return <AnalysisPipeline {...props} />;
};
