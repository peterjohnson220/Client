export interface SupportTeamUser {
  UserId: number;
  FirstName: string;
  LastName: string;
  Title?: string;
  PhoneNumber?: string;
  EmailAddress?: string;
  UserPicture?: string;
}

export function generateMockSupportTeamUser(): SupportTeamUser {
  return {
    UserId: 1234,
    FirstName: 'John',
    LastName: 'Smith',
    Title: 'CEO'
  };
}
