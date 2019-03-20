export interface UserTicketGridItem {
  Id: number;
  Created?: Date;
  CompanyName: string;
  CompanyId: number;
  Type: string;
  Status: string;
  OpenedUser: string;
  ServiceUser: string;
  Comments: string;
}

export function generateMockUserTicketGridItem(): UserTicketGridItem {
  return  {
    Id: 1,
    Created: new Date('01/01/1990'),
    CompanyName: 'MockCompanyName',
    CompanyId: 0,
    Type: 'MockType',
    Status: 'New',
    OpenedUser: 'MockOpenedUser',
    ServiceUser: 'MockServiceUser',
    Comments: 'MockComments'
  };
}
