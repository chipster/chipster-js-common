import { WorkflowPlan, WorkflowRun } from "..";
import Dataset from "../model/dataset";
import Job from "../model/job";
import Rule from "../model/rule";
import Session from "../model/session";
export default class SessionEvent {
  constructor(
    public event: any,
    public oldValue:
      | Dataset
      | Job
      | Session
      | Rule
      | WorkflowPlan
      | WorkflowRun,
    public newValue: Dataset | Job | Session | Rule | WorkflowPlan | WorkflowRun
  ) {}
}
