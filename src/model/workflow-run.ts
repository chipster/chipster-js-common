import { JobState } from "./job";

export default class Job {
  created: string;
  endTime: string;
  workflowRunId: string;
  sessionId: string;
  workflowPlanId: string;
  currentWorkflowJobPlanId: string;
  currentJobPlanId: string;
  state: JobState;
  createdBy: string;
  name: string;
}
