import {generateMockUserTicketTabItems, UserTicketTabItem} from '../../../../../apps/admin/app/_tickets/models';

export interface UserTicketCompanyDetailResponse {
  CompanyName: string;
  CompanyId: number;
  ClientType: string;
  NumberOfDays: number;
  NumberOfOpenTickets: number;
  NumberOfRecentTickets: number;
  RecentTickets: UserTicketTabItem[];
  NotesCount: number;
}

export function generateMockUserTicketCompanyDetailResponse() {
  return {
    CompanyName: 'MockCompanyName',
    CompanyId: 1,
    ClientType: 'MockClientType',
    NumberOfDays: 1,
    NumberOfOpenTickets: 1,
    NumberOfRecentTickets: 1,
    RecentTickets: generateMockUserTicketTabItems()
  };
}
