export interface SupportTeamResponse {
  UserId: number;
  FirstName: string;
  LastName: string;
  JobTitle: string;
  PhoneNumber: string;
  EmailAddress: string;
  UserPicture: string;
  Team: SupportTeam;
}

export enum SupportTeam {
  ClientServices = 'Client Services',
  ClientSuccess = 'Client Success',
  Compensation = 'Compensation',
  Peer = 'Peer'
}
