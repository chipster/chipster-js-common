import Dataset from "../model/dataset";
import Job from "../model/job";
import Session from "../model/session";
import Rule from "../model/rule";

export default class SessionEvent {
    constructor(
      public event: any,
      public oldValue: Dataset | Job | Session | Rule,
      public newValue: Dataset | Job | Session | Rule) {
    }
}
