export interface Feature {
  id: string;
  title: string;
  description: string;
  teamId: string;
  epicId: string;
  priority: number;
  createdDate: Date;
  updatedDate: Date;
  isCompleted: boolean;
  isDeleted: boolean;
}
