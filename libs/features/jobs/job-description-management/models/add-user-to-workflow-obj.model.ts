export interface AddUserToWorkflowObj {
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  JobId: number;
  IsNonPfUser: boolean;
  StepIndex?: number;
}
