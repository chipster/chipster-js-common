import WorkflowJob from "./workflow-job";

export enum WorkflowState {
  New = "NEW",
  Running = "RUNNING",
  Completed = "COMPLETED",
  Failed = "FAILED",
  Error = "ERROR",
  Cancelled = "CANCELLED",
  Cancelling = "CANCELLING",
  Draining = "DRAINING",
}

export enum DrainMode {
  Ignore = "IGNORE",
  BailOut = "BAIL_OUT",
  Drain = "Drain",
}

export default class WorkflowRun {
  created: string;
  endTime: string;
  workflowRunId: string;
  sessionId: string;
  state: WorkflowState;
  stateDetail: string;
  createdBy: string;
  name: string;
  workflowJobs: WorkflowJob[];
  runningTimeout: number;
  cancellingTimeout: number;
  drainingTimeout: number;
  onError: DrainMode;
}
