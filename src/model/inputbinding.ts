import Dataset from "./dataset.js";
import ToolInput from "./toolinput.js";

export default class InputBinding {
  toolInput: ToolInput;
  datasets: Dataset[] = [];
}
