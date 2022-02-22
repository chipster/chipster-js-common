import JobInput from "./jobinput";
import JobParameter from "./jobparameter";
import MetadataFile from "./metadata-file";

export enum JobState {
  New = "NEW",
  Running = "RUNNING",
  Completed = "COMPLETED",
  Failed = "FAILED",
  FailedUserError = "FAILED_USER_ERROR",
  Error = "ERROR",
  Timeout = "TIMEOUT",
  Cancelled = "CANCELLED",
  CompBusy = "COMP_BUSY",
  Rescheduled = "RESCHEDULED",
  Scheduled = "SCHEDULED",
  Waiting = "WAITING",
  ExpiredWaiting = "EXPIRED_WAITING"
}

export default class Job {
  created: string;
  endTime: string;
  inputs: JobInput[];
  jobId: string;
  sessionId: string;
  module: string;
  parameters: JobParameter[];
  memoryUsage: number;
  metadataFiles: MetadataFile[];
  screenOutput: string;
  sourceCode: string;
  startTime: string;
  state: JobState;
  stateDetail: string;
  toolCategory: string;
  toolDescription: string;
  toolId: string;
  toolName: string;
  createdBy: string;
}
