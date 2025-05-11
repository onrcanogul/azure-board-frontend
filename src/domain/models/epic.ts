export interface Epic {
  id: string;
  title: string;
  description: string;
  areaId: string;
  teamId: string;
  priority: number;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
  updatedDate: Date;
  isDeleted: boolean;
}
