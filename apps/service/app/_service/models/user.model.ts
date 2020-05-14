export interface SupportTeamUser {
  UserId: number;
  FirstName: string;
  LastName: string;
  Title?: string;
  PhoneNumber?: string;
  EmailAddress?: string;
  UserPicture?: string;
  Team?: SupportTeam;
}

export enum SupportTeam {
  ClientServices = 'Client Services',
  ClientSuccess = 'Client Success',
  Compensation = 'Compensation',
  Peer = 'Peer'
}

export function generateMockSupportTeamUser(): SupportTeamUser {
  return {
    UserId: 1234,
    FirstName: 'John',
    LastName: 'Smith',
    Title: 'CEO'
  };
}
