import type { FileState } from "../model/dataset.js";
import { JobState } from "../model/job.js";
import { SessionState } from "../model/session.js";

export const enum Resource {
  Dataset = "DATASET",
  Job = "JOB",
  Session = "SESSION",
  Rule = "RULE",
  News = "NEWS",
}

export const enum EventType {
  Create = "CREATE",
  Update = "UPDATE",
  Delete = "DELETE",
}

export default class WsEvent {
  constructor(
    public sessionId: string,
    public resourceType: Resource,
    public resourceId: string,
    public type: EventType,
    public state: SessionState | JobState | FileState,
  ) {}

  serverId: string;
  eventNumber: number;
}
