import { PbiState } from "../models/productBacklogItem";

export interface PbiCreatedCommand {
  id?: string;
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
}

export interface PbiUpdateCommand {
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
}

export interface PbiDeleteCommand {
  id: string;
}
