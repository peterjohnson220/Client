export interface UserContext {
  AccessLevel: string;
  CompanyId: number;
  ConfigSettings: ConfigSetting[];
  EmailAddress: string;
  EmployeeAcknowledgementInfo: EmployeeAcknowledgementInfo;
  FirstName: string;
  ImpersonatorId: number;
  IsPublic: boolean;
  LastName: string;
  Name: string;
  Permissions: string[];
  SystemUserGroupsId: number;
  UserId: number;
  UserIdentifier: string;
  UserPicture: string;
  WorkflowStepInfo: WorkflowStepInfo;
}


interface ConfigSetting {
  Name: string;
  Value: string;
}

interface EmployeeAcknowledgementInfo {
  EmployeeAcknowledgementId: number;
  Version: number;
  IsLatest: boolean;
  HasAcknowledged: boolean;
}


interface WorkflowStepInfo {
  WorkflowId: number;
  IsResubmission: boolean;
  IsFirstStep: boolean;
  IsFirstRecipent: boolean;
  IsLastStep: boolean;
}
