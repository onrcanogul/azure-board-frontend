import { BugStatus } from "../models/bug";

export interface BugCreatedCommand {
  id?: string;
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
  tagIds: Set<string>;
}

export interface BugUpdatedCommand {
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
  tagIds: Set<string>;
}

export interface BugDeletedCommand {
  id: string;
}
