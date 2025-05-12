export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdDate: Date;
  updatedDate: Date;
}
