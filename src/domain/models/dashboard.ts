import type { Bug } from "./bug";
import type { ProductBacklogItem } from "./productBacklogItem";

export interface Dashboard {
  productBacklogItems: ProductBacklogItem[];
  bugs: Bug[];
}
