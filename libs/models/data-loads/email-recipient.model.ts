export interface EmailRecipientModel {
  DataLoadEmailRecipientId: number;
  CompanyId: number;
  UserId: number;
  EmailAddress: string;
  FirstName: string;
  LastName: string;
  LoaderType: string;
  IsCompanyServicesRep: boolean;
  UserPicture: string;
  LoaderConfigurationGroupId: number;
}

export function GenerateMockEmailRecipient(): EmailRecipientModel {
  return {
    DataLoadEmailRecipientId: 1,
    CompanyId: 1,
    UserId: 1,
    EmailAddress: 'test@test.test',
    FirstName: 'Mock',
    LastName: 'Recipient',
    LoaderType: 'OrgData',
    IsCompanyServicesRep: false,
    UserPicture: 'default_user.png',
    LoaderConfigurationGroupId: 1
  };
}
