import Rule from "./rule";

export const enum SessionState {
    Import = "IMPORT",
    Temporary = "TEMPORARY",
    Ready = "READY",
    Delete = "DELETE",
}

export default class Session {

    constructor (public name: string) {
    }
    accessed: string;
    created: string;
    notes: string;
    sessionId: string;
    rules: Array<Rule>;
    state: SessionState;
}

