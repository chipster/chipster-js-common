import Rule from "./rule.js";

export const enum SessionState {
  Import = "IMPORT",
  TemporaryUnmodified = "TEMPORARY_UNMODIFIED",
  Ready = "READY",
  Delete = "DELETE",
  TemporaryModified = "TEMPORARY_MODIFIED",
}

export default class Session {
  constructor(public name: string) {}
  accessed: string;
  created: string;
  notes: string;
  sessionId: string;
  rules: Array<Rule>;
  state: SessionState;
}
