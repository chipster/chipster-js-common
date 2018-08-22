import SessionEvent from "./events/sessionevent";
import WsEvent from "./events/wsevent";
import { JobHistory } from "./model/jobhistory";
import { Role } from "./model/role";
import { Service } from "./model/service";
import { User } from "./model/user";
import Category from "./model/category";
import Dataset from "./model/dataset";
import InputBinding from "./model/inputbinding";
import Job from "./model/job";
import JobInput from "./model/jobinput";
import JobParameter from "./model/jobparameter";
import MetadataEntry from "./model/metadataentry";
import Module from "./model/module";
import Name from "./model/name";
import Output from "./model/output";
import Rule from "./model/rule";
import Session from "./model/session";
import Tool from "./model/tool";
import ToolInput from "./model/toolinput";
import ToolParameter from "./model/toolparameter";

module.exports = {
    SessionEvent: SessionEvent,
    WsEvent: WsEvent,
    JobHistory: JobHistory,
    Role: Role,
    Service: Service,
    User: User,
    Category: Category,
    Dataset: Dataset,
    InputBinding: InputBinding,
    Job: Job,
    JobInput: JobInput,
    JobParameter: JobParameter,
    MetadataEntry: MetadataEntry,
    Module: Module,
    Name: Name,
    Output: Output,
    Rule: Rule,
    Session: Session,
    Tool: Tool,
    ToolInput: ToolInput,
    ToolParameter: ToolParameter,
}