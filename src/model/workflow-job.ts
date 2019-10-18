import JobParameter from "./jobparameter";
import MetadataFile from "./metadata-file";
import WorkflowInput from "./workflow-input";

export default class WorkflowJob {
  workflowJobId: string;
  jobId: string;
  inputs: WorkflowInput[];
  sessionId: string;
  module: string;
  parameters: JobParameter[];
  metadataFiles: MetadataFile[];
  toolCategory: string;
  toolId: string;
  toolName: string;
}
