export const ItemTypes = {
  CARD: "card",
};

export interface DragItem {
  id: string;
  type: string;
  originalState: string;
  workItemType?: string; // WorkItemType enum value
}
