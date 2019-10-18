import { JobState } from "./job";
import WorkflowJob from "./workflow-job";

export default class Job {
  created: string;
  endTime: string;
  workflowRunId: string;
  sessionId: string;
  state: JobState;
  stateDetail: string;
  createdBy: string;
  name: string;
  workflowJobs: WorkflowJob[];
}
