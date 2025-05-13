export enum SprintState {
  INACTIVE = 0,
  ACTIVE = 1,
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: string;
  state: SprintState;
  projectId: string;
  teamId: string;
}
