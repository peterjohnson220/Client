export class UserGridItem {
  UserId: number;
  CompanyId: number;
  FirstName: string;
  LastName: string;
  JobTitle: string;
  EmailAddress: string;
  LastLogin?: Date;
  Active: boolean;
  SsoId?: string;
}

export function generateMockUserGridItems(): UserGridItem[] {
  return [
    {
      UserId: 1,
      CompanyId: 1,
      FirstName: 'Mock 1',
      LastName: 'Name 1',
      JobTitle: 'Mock Title 1',
      EmailAddress: 'mockemail-1@mock.com',
      LastLogin: null,
      Active: true,
      SsoId: 'mockSSO1'
    },
    {
      UserId: 2,
      CompanyId: 1,
      FirstName: 'New Mock 2',
      LastName: 'Name 2',
      JobTitle: 'Mock Title 2',
      EmailAddress: 'mockemail-2@mock.com',
      LastLogin: null,
      Active: false,
      SsoId: null
    },
    {
      UserId: 1,
      CompanyId: 1,
      FirstName: 'Mock 3',
      LastName: 'New Name 3',
      JobTitle: 'Mock Title 3',
      EmailAddress: 'mockemail-3@mock.com',
      LastLogin: null,
      Active: true,
      SsoId: ''
    }
  ];
}

export function generateMockFilteredUserList(): UserGridItem[] {
  return [
    {
      UserId: 1,
      CompanyId: 1,
      FirstName: 'Mock 1',
      LastName: 'Name 1',
      JobTitle: 'Mock Title 1',
      EmailAddress: 'mockemail-1@mock.com',
      LastLogin: null,
      Active: true,
      SsoId: 'mockSSO1'
    }
  ];
}
