import {generateMockUserTicketTabItems, UserTicketTabItem} from './user-ticket-tab-item.model';

export interface CompanyDetail {
  Id: number;
  Name: string;
  ClientType: string;
  OpenTickets: number;
  RangeOfOpenedTickets: number;
  RecentTickets: number;
  RecentTicketIds: UserTicketTabItem[];
  NotesCount: number;
}

export function generateMockCompanyDetail() {
  return {
    Id: 1,
    Name: 'MockCompanyDetailName',
    ClientType: 'MockClientType',
    OpenTickets: 1,
    RangeOfOpenedTickets: 1,
    RecentTickets: 1,
    RecentTicketIds: generateMockUserTicketTabItems(),
    NotesCount: 1,
  };
}
