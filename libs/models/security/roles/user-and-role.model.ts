export class UserAndRoleModel {
  UserId: number;
  RoleName: string;
  CurrentRoleId: number;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  Title: string;
  LastLogin: Date;
  PreviousRoleId: number;
  Dirty = false;
}

export function getMockUsersAndRoles(): UserAndRoleModel[] {
  const usersToReturn: UserAndRoleModel[] = [];
  const mockUser1: UserAndRoleModel = <UserAndRoleModel>{
    UserId: 1,
    RoleName: 'Test Role 1',
    CurrentRoleId: 1,
    FirstName: 'Test',
    LastName: 'User1',
    EmailAddress: 'testuser1@payfactors.com',
    Title: 'Test User',
    LastLogin: new Date()
  };

  usersToReturn.push(mockUser1);

  const mockUser2: UserAndRoleModel = <UserAndRoleModel>{
    UserId: 2,
    RoleName: 'Test Role 2',
    CurrentRoleId: 2,
    FirstName: 'Test',
    LastName: 'User2',
    EmailAddress: 'testuser2@payfactors.com',
    Title: 'Test User',
    LastLogin: new Date()
  };

  usersToReturn.push(mockUser2);

  const mockUser3: UserAndRoleModel = <UserAndRoleModel>{
    UserId: 3,
    FirstName: 'Test',
    LastName: 'User1',
    EmailAddress: 'testuser1@payfactors.com',
    Title: 'Test User',
    LastLogin: new Date()
  };

  usersToReturn.push(mockUser3);

  return usersToReturn;
}
