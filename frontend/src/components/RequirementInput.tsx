"use client";

import React from "react";
import { RequirementComposer, RequirementComposerProps } from "./RequirementComposer";

export { RequirementComposer };
export type { RequirementComposerProps };

export const RequirementInput: React.FC<RequirementComposerProps> = (props) => {
  return <RequirementComposer {...props} />;
};
