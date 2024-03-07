import type Dataset from "../model/dataset.js";
import type Job from "../model/job.js";
import type Rule from "../model/rule.js";
import type Session from "../model/session.js";

export default class SessionEvent {
  constructor(
    public event: any,
    public oldValue: Dataset | Job | Session | Rule,
    public newValue: Dataset | Job | Session | Rule
  ) {}
}
