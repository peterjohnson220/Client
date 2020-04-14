import { UserTicketFile } from 'libs/models/payfactors-api/service/response';

export interface UserTicket {
  TicketId: number;
  TicketSummary: string;
  TicketStatus: string;
  TicketType: string;
  TicketDetails: string;
  Attachments?: UserTicketFile[];
}

export function generateMockUserTicket(): UserTicket {
  return {
    TicketId: 1,
    TicketSummary: 'Summary',
    TicketStatus: 'New',
    TicketType: 'Product Issue/Bug',
    TicketDetails: 'Here are my details'
  };
}
