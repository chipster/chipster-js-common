import Name from "./name";
import ToolInputType from "./toolinputtype";
export default class ToolInput {
  description: string;
  meta: boolean;
  name: Name;
  optional: boolean;
  type: ToolInputType;
}
