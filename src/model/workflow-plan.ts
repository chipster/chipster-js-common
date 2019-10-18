import WorkflowJob from "./workflow-job";

export default class WorkflowPlan {
  created: string;
  name: string;
  workflowPlanId: string;
  sessionId: string;
  originalDuration: string;
  notes: string;
  workflowJobs: WorkflowJob[];
}
