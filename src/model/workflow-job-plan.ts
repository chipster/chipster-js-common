import JobInput from "./jobinput";
import JobParameter from "./jobparameter";
import MetadataFile from "./metadata-file";

export default class WorkflowJobPlan {
  workflowJobPlanId: string;
  inputs: JobInput[];
  sessionId: string;
  module: string;
  parameters: JobParameter[];
  metadataFiles: MetadataFile[];
  toolCategory: string;
  toolId: string;
  toolName: string;
}
