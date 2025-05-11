export interface Feature {
  id: string;
  title: string;
  description: string;
  areaId: string;
  epicId: string;
  priority: number;
  createdDate: Date;
  updatedDate: Date;
  isCompleted: boolean;
  isDeleted: boolean;
}
