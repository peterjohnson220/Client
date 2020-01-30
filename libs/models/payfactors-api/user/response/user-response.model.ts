export interface UserResponse {
  UserId: number;
  CompanyId: number;
  AccessLevel: string;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  Title: string;
  Active?: boolean;
  UserPicture: string;
  SystemUserGroupsId?: number;
  PhoneNumber: string;
  CompanyName: string;
  PfServicesRep?: boolean;
  LastLogin?: Date;
  SsoId: string;
  ImpersonatorId?: number;
  UserSubsidiaryIds: string[];
}

export function generateMockUserResponse(): UserResponse {
  return {
    UserId: 1,
    CompanyId: 13,
    AccessLevel: 'MockAccessLevel',
    FirstName: 'MockFirstName',
    LastName: 'MockLastName',
    EmailAddress: 'mock@email.com',
    Title: 'MockTitle',
    Active: true,
    UserPicture: 'mock.png',
    SystemUserGroupsId: 1,
    PhoneNumber: '1-800-54-GIANT',
    CompanyName: 'MockCompany',
    PfServicesRep: true,
    LastLogin: new Date(2019, 4, 25),
    SsoId: 'MockSso',
    ImpersonatorId: null,
    UserSubsidiaryIds: ['1', '2', '3']
  };
}
