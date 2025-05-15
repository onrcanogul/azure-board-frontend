export enum PbiState {
  NEW = "NEW",
  ACTIVE = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface ProductBacklogItem {
  id: string;
  sprintId: string;
  areaId: string;
  featureId: string;
  assignedUserId: string;
  description: string;
  functionalDescription: string;
  technicalDescription: string;
  priority: number;
  state: PbiState;
  storyPoint: number;
  businessValue: number;
  dueDate: Date;
  startedDate: Date;
  completedDate: Date;
  tagIds: Set<string>;
  isDeleted: boolean;
}
