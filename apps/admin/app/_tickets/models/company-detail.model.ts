export interface CompanyDetail {
  Name: string;
  ClientType: string;
  OpenTickets: number;
  RangeOfOpenedTickets: number;
  RecentTickets: number;
  RecentTicketIds: number[];
}

export function generateMockCompanyDetail() {
  return {
    Name: 'MockCompanyDetailName',
    ClientType: 'MockClientType',
    OpenTickets: 1,
    RangeOfOpenedTickets: 1,
    RecentTickets: 1,
    RecentTicketIds: [1]
  };
}
