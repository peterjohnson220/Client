export interface TicketDetail {
  TicketId: number;
  CompanyId: number;
  CompanyName: string;
  ServicesUserId?: number;
  EditDate: Date;
  CreateDate: Date;
  OpenedBy: string;
  TicketTypeDisplayName: string;
  TicketType: string;
  TicketSubType: string;
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
    TicketTypeDisplayName: 'MockTicketTpye - MockTicketSubType',
    TicketType: 'MockTicketType',
    TicketSubType: 'MockTicketSubType',
    TicketCssClass: 'MockTicketCssClass',
    TicketState: 'MockTicketState',
    LastUpdatedText: 'MockLastUpdatedText'
  };
}
