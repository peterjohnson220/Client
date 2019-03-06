export interface UserTicketSearchRequest {
  ServicesUser_ID?: number;
  UserTicket_State?: string;
  Company_ID?: number;
  UserTicket_Type?: string;
  StartDate?: Date;
  EndDate?: Date;
}

export function generateMockUserTicketSearchRequest(): UserTicketSearchRequest {
  return {
    ServicesUser_ID: 1,
    UserTicket_State: 'New',
    Company_ID: 13,
    UserTicket_Type: 'Question',
    StartDate: new Date(2019, 3, 1),
    EndDate: new Date(2019, 3, 31)
  };
}
