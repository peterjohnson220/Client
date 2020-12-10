import { CompanyClientTypeConstants } from '../../constants';

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
  CompanySystemUserGroupsId: number;
  CompanySystemUserGroupsGroupName: string;
  UserId: number;
  UserIdentifier: string;
  UserPicture: string;
  WorkflowStepInfo: WorkflowStepInfo;
  IpAddress: string;
  SessionId: string;
  RoleName: string;
  ClientType: string;
  DefaultPayMarketId: number;
  MapboxAccessToken: string;
  FeatureFlagBootstrapJson: string;
  Title?: string;
}

export interface ConfigSetting {
  Name: string;
  Value: string;
}

interface EmployeeAcknowledgementInfo {
  EmployeeAcknowledgementId: number;
  Version: number;
  IsLatest: boolean;
  HasAcknowledged: boolean;
}

export interface WorkflowStepInfo {
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
    CompanySystemUserGroupsId: 1,
    CompanySystemUserGroupsGroupName: 'Payfactors Support',
    UserId: 1,
    UserIdentifier: '',
    UserPicture: 'FakePicture.Jpg',
    WorkflowStepInfo: null,
    IpAddress: '127.0.0.1',
    SessionId: '335f3387-77b2-4aca-95b6-2809c78c6c6a',
    RoleName: 'Company Administrator',
    ClientType: CompanyClientTypeConstants.ENTERPRISE,
    DefaultPayMarketId: 1,
    MapboxAccessToken: 'SomeToken',
    FeatureFlagBootstrapJson: 'FeatureFlag',
    Title: 'Accountant'
  };
}
