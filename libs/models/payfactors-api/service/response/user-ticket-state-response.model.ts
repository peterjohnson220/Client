export interface UserTicketStateResponse {
  UserTicketStateId: number;
  TicketStateName: string;
  SortOrder: number;
  Active: boolean;
  CreateDate: Date;
  CreateUser: number;
  EditDate: Date;
  EditUser: number;
}

export function generateMockUserTicketStateResponse(): UserTicketStateResponse {
  return {
    UserTicketStateId: 1,
    TicketStateName: 'New',
    SortOrder: 1,
    Active: true,
    CreateDate: new Date(2019, 3, 28),
    CreateUser: -1,
    EditDate: new Date(2019, 3, 28),
    EditUser: -1,
  };
}
