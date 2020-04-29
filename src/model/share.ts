
export const enum ShareType {
  Copy = "COPY",
  Read = "READ",
  Full = "FULL",
}

export const enum ShareState {
  Pending = "PENDING",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED",
}

export default class Share {
  constructor() {}
  
  shareId: string;
  shareBy: string;
  shareTo: string;
  shareType: ShareType;
  shareState: ShareState;
  created: string;
  sessionId: string;
}
