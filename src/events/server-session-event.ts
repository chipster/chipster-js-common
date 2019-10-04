import { EventType, Resource } from "./wsevent";

export default class ServerSessionEvent {
  sessionId: string;
  resource: Resource;
  type: EventType;
  serverId: string;
  eventNumber: number;
  resourceId: string;
  state: string;
}
