export interface UserContext {
  AccessLevel: string;
  CompanyId: number;
  CompanyName: string;
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
  IsFirstRecipient: boolean;
  IsLastStep: boolean;
}

export function generateMockUserContext(): UserContext {
  return {
    AccessLevel: 'Admin',
    CompanyId: 13,
    CompanyName: 'Company Name',
    ConfigSettings: [],
    EmailAddress: 'johndoe@payfactors.com',
    EmployeeAcknowledgementInfo: null,
    FirstName: 'John',
    ImpersonatorId: 0,
    IsPublic: false,
    LastName: 'Doe',
    Name: 'John Doe',
    Permissions: [],
    SystemUserGroupsId: 1,
    UserId: 1,
    UserIdentifier: '',
    UserPicture: 'FakePicture.Jpg',
    WorkflowStepInfo: null
  };
}
