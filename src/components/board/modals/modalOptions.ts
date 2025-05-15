import type { IDropdownOption, IComboBoxOption } from "@fluentui/react";
import { PbiState } from "../../../domain/models/productBacklogItem";
import { BugStatus } from "../../../domain/models/bug";

// Standard state options used by generic work items
export const stateOptions: IDropdownOption[] = [
  { key: "To Do", text: "To Do" },
  { key: "Doing", text: "Doing" },
  { key: "Done", text: "Done" },
];

// PBI-specific state options
export const pbiStateOptions: IDropdownOption[] = [
  { key: PbiState.NEW, text: "New" },
  { key: PbiState.ACTIVE, text: "Active" },
  { key: PbiState.RESOLVED, text: "Resolved" },
  { key: PbiState.CLOSED, text: "Closed" },
];

// Bug-specific state options
export const bugStateOptions: IDropdownOption[] = [
  { key: BugStatus.NEW, text: "New" },
  { key: BugStatus.ACTIVE, text: "Active" },
  { key: BugStatus.RESOLVED, text: "Resolved" },
  { key: BugStatus.CLOSED, text: "Closed" },
];

// Epic state options
export const epicStateOptions: IDropdownOption[] = [
  { key: "New", text: "New" },
  { key: "In Progress", text: "In Progress" },
  { key: "Completed", text: "Completed" },
];

// Feature state options
export const featureStateOptions: IDropdownOption[] = [
  { key: "New", text: "New" },
  { key: "In Progress", text: "In Progress" },
  { key: "Completed", text: "Completed" },
];

export const areaOptions: IDropdownOption[] = [
  { key: "1e52c4c1-7d20-4f62-a3d1-267dd2ab4e65", text: "OO" },
  { key: "frontend", text: "Frontend" },
  { key: "backend", text: "Backend" },
];

export const iterationOptions: IDropdownOption[] = [
  { key: "d290f1ee-6c54-4b01-90e6-d701748f0851", text: "Sprint 1" },
  { key: "sprint2", text: "Sprint 2" },
];

export const priorityOptions: IDropdownOption[] = [
  { key: 1, text: "1" },
  { key: 2, text: "2" },
  { key: 3, text: "3" },
];

export const userOptions: IComboBoxOption[] = [
  { key: "", text: "No one selected" },
  { key: "a8e4ed53-b671-4f21-a3ee-fc87f1299a11", text: "Onur Can Oğul" },
  { key: "user2", text: "Muhammed Salih Koç" },
  { key: "user3", text: "Ayşe Yılmaz" },
];
