import Category from "./category.js";
export default class Module {
  name: string;
  categories: Category[];
  moduleId: string;
  categoriesMap: Map<string, Category>;
}
