export const ItemTypes = {
  CARD: "card",
};

export interface DragItem {
  id: number;
  type: string;
  originalState: string;
}
