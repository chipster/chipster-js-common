import WorkflowJobPlan from "./workflow-job-plan";

export default class WorkflowPlan {
  created: string;
  name: string;
  workflowPlanId: string;
  sessionId: string;
  originalDuration: string;
  notes: string;
  workflowJobPlans: WorkflowJobPlan[];
}
