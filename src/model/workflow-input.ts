import JobInput from "./jobinput";

export default class WorkflowInput extends JobInput {
  sourceJobOutputId: string;
  sourceJobId;
  sourceWorkflowJobId: string;
  inputId: string;
  description: string;
  datasetId: string;
  displayName: string;
}
