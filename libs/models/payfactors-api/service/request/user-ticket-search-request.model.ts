export interface UserTicketSearchRequest {
  ServicesUser_ID?: number;
  UserTicket_State?: string;
  Company_ID?: number;
  Company_Name?: string;
  Company_IDName?: string;
  Opened_User?: string;
  UserTicket_Type?: string;
  StartDate?: Date;
  EndDate?: Date;
  UserTicket_ID?: number;
  Skip: number;
  Take: number;
  SortField: string;
  SortDirection: string;
  ModifiedStartDate?: Date;
  ModifiedEndDate?: Date;
}

export function generateMockUserTicketSearchRequest(): UserTicketSearchRequest {
  return {
    ServicesUser_ID: 1,
    UserTicket_State: 'New',
    Company_ID: 13,
    Opened_User: 'Ryan Moore',
    UserTicket_Type: 'Question',
    StartDate: new Date(2019, 3, 1),
    EndDate: new Date(2019, 3, 31),
    Skip: 0,
    Take: 25,
    SortField: 'TicketId',
    SortDirection: 'asc'
  };
}
