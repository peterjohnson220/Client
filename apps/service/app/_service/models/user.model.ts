import { SupportTeam } from 'libs/models/payfactors-api/service/response';

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

export function generateMockSupportTeamUser(): SupportTeamUser {
  return {
    UserId: 1234,
    FirstName: 'John',
    LastName: 'Smith',
    Title: 'CEO'
  };
}
