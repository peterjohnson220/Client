export interface TicketDetail {
  TicketId: number;
  CompanyId: number;
  CompanyName: string;
  ServicesUserId?: number;
  EditDate: Date;
  CreateDate: Date;
  OpenedBy: string;
  TicketType: string;
  TicketCssClass: string;
  TicketState: string;
  LastUpdatedText: string;
}

export function generateMockTicketDetail() {
  return {
    TicketId: 1,
    CompanyId: 13,
    ServicesUserId: 1,
    CompanyName: 'MockCompanyName',
    EditDate: new Date('1/1/1990'),
    CreateDate: new Date('1/1/1990'),
    OpenedBy: 'MockOpenedByUser',
    TicketType: 'MockTicketType',
    TicketCssClass: 'MockTicketCssClass',
    TicketState: 'MockTicketState',
    LastUpdatedText: 'MockLastUpdatedText'
  };
}
