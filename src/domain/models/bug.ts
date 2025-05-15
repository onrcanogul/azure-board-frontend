export enum BugStatus {
  NEW = "NEW",
  ACTIVE = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface Bug {
  id: string;
  sprintId: string;
  areaId: string;
  featureId: string;
  assignedUserId: string;
  description: string;
  functionalDescription: string;
  technicalDescription: string;
  priority: number;
  status: BugStatus;
  storyPoint: number;
  businessValue: number;
  dueDate: Date;
  startedDate: Date;
  completedDate: Date;
  isNoBug: boolean;
  isDeleted: boolean;
  tagIds: Set<string>;
}
