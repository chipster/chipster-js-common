import Name from "./name.js";
import ToolInputType from "./toolinputtype.js";
export default class ToolInput {
  description: string;
  meta: boolean;
  name: Name;
  optional: boolean;
  type: ToolInputType;
}
