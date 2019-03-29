import {generateMockTicketDetail, TicketDetail} from './ticket-detail.model';


export interface UserTicketItem {
  TicketInfo: TicketDetail;
  Description: string;
}

export function generateMockUserTicketItem() {
  return {
    Description: 'MockDescription',
    TicketDetail: generateMockTicketDetail()
  };
}
