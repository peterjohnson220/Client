export interface WorkflowUser {
  EmailAddress: string;
  FirstName: string;
  IsNonPfUser: boolean;
  LastName: string;
  Permissions: any[];
  StepId?: number;
  UserId?: number;
  UserPicture?: string;
}
