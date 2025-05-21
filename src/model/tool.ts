import Name from "./name.js";
import Output from "./output.js";
import Parameter from "./toolparameter.js";
import ToolInput from "./toolinput.js";

export default class Tool {
  description: string;
  inputs: ToolInput[];
  name: Name;
  outputs: Output[];
  parameters: Parameter[];
  slotCount: number;
  storage: number;
}
