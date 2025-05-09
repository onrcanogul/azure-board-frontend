import type { IDropdownOption, IComboBoxOption } from "@fluentui/react";

export const stateOptions: IDropdownOption[] = [
  { key: "To Do", text: "To Do" },
  { key: "Doing", text: "Doing" },
  { key: "Done", text: "Done" },
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
