import Tool from "./tool.js";

export default class Category {
  name: string;
  color: string;
  hidden: boolean;
  tools: Tool[];
}
