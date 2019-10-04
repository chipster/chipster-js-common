import { JobState } from "../model/job";
import { SessionState } from "../model/session";

export const enum Resource {
  Dataset = "DATASET",
  Job = "JOB",
  Session = "SESSION",
  Rule = "RULE",
  WorkflowPlan = "WORKFLOW_PLAN",
  WorkflowRun = "WORKFLOW_RUN"
}

export const enum EventType {
  Create = "CREATE",
  Update = "UPDATE",
  Delete = "DELETE"
}

export default class WsEvent {
  constructor(
    public sessionId: string,
    public resourceType: Resource,
    public resourceId: string,
    public type: EventType,
    public state: SessionState | JobState
  ) {}

  serverId: string;
  eventNumber: number;
}
