export interface TicketDetail {
  TicketId: number;
  CompanyName: string;
  EditDate: Date;
  CreateDate: Date;
  OpenedBy: string;
  TicketType: string;
  TicketCssClass: string;
  TicketState: string;
}

export function generateMockTicketDetail() {
  return {
    TicketId: 1,
    CompanyName: 'MockCompanyName',
    EditDate: new Date('1/1/1990'),
    CreateDate: new Date('1/1/1990'),
    OpenedBy: 'MockOpenedByUser',
    TicketType: 'MockTicketType',
    TicketCssClass: 'MockTicketCssClass',
    TicketState: 'MockTicketState'
  };
}
