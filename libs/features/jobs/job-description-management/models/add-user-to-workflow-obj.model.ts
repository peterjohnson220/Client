export interface AddUserToWorkflowObj {
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  JobIds: number[];
  IsNonPfUser: boolean;
  StepIndex?: number;
  Permissions: any;
}
