
export const enum ShareType {
  Copy = "COPY",
  Read = "READ",
  Full = "FULL",
}

export default class Share {
  constructor() {}
  
  shareId: string;
  shareBy: string;
  shareTo: string;
  shareType: ShareType;
  created: string;
}
