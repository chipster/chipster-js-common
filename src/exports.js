"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sessionevent_1 = require("./events/sessionevent");
var wsevent_1 = require("./events/wsevent");
var jobhistory_1 = require("./model/jobhistory");
var role_1 = require("./model/role");
var service_1 = require("./model/service");
var user_1 = require("./model/user");
var category_1 = require("./model/category");
var dataset_1 = require("./model/dataset");
var inputbinding_1 = require("./model/inputbinding");
var job_1 = require("./model/job");
var jobinput_1 = require("./model/jobinput");
var jobparameter_1 = require("./model/jobparameter");
var metadataentry_1 = require("./model/metadataentry");
var module_1 = require("./model/module");
var name_1 = require("./model/name");
var output_1 = require("./model/output");
var rule_1 = require("./model/rule");
var session_1 = require("./model/session");
var tool_1 = require("./model/tool");
var toolinput_1 = require("./model/toolinput");
var toolparameter_1 = require("./model/toolparameter");
module.exports = {
    SessionEvent: sessionevent_1.default,
    WsEvent: wsevent_1.default,
    JobHistory: jobhistory_1.JobHistory,
    Role: role_1.Role,
    Service: service_1.Service,
    User: user_1.User,
    Category: category_1.default,
    Dataset: dataset_1.default,
    InputBinding: inputbinding_1.default,
    Job: job_1.default,
    JobInput: jobinput_1.default,
    JobParameter: jobparameter_1.default,
    MetadataEntry: metadataentry_1.default,
    Module: module_1.default,
    Name: name_1.default,
    Output: output_1.default,
    Rule: rule_1.default,
    Session: session_1.default,
    Tool: tool_1.default,
    ToolInput: toolinput_1.default,
    ToolParameter: toolparameter_1.default,
};
