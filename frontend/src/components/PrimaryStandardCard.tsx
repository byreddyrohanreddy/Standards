"use client";

import React from "react";
import { PrimaryRecommendation, PrimaryRecommendationProps } from "./PrimaryRecommendation";

export { PrimaryRecommendation };
export type { PrimaryRecommendationProps };

export const PrimaryStandardCard: React.FC<PrimaryRecommendationProps> = (props) => {
  return <PrimaryRecommendation {...props} />;
};
