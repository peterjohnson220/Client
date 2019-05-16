export interface UserTicketState {
  UserTicketStateId: number;
  UserTicketState: string;
}

export function generateMockUserTicketState(): UserTicketState {
  return {
    UserTicketStateId: 1,
    UserTicketState: 'New'
  };
}
