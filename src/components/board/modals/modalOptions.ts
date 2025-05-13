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
  { key: "OO", text: "OO" },
  { key: "Frontend", text: "Frontend" },
  { key: "Backend", text: "Backend" },
];

export const iterationOptions: IDropdownOption[] = [
  { key: "OO\\Sprint 1", text: "OO\\Sprint 1" },
  { key: "OO\\Sprint 2", text: "OO\\Sprint 2" },
];

export const priorityOptions: IDropdownOption[] = [
  { key: 1, text: "1" },
  { key: 2, text: "2" },
  { key: 3, text: "3" },
];

export const userOptions: IComboBoxOption[] = [
  { key: "", text: "No one selected" },
  { key: "onurcan", text: "Onur Can Oğul" },
  { key: "salih", text: "Muhammed Salih Koç" },
  { key: "ayse", text: "Ayşe Yılmaz" },
];
