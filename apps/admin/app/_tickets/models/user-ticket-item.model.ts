import { generateMockTicketDetail, TicketDetail } from './ticket-detail.model';
import { CompanyDetail, generateMockCompanyDetail } from './company-detail.model';


export interface UserTicketItem {
  TicketInfo: TicketDetail;
  CompanyInfo: CompanyDetail;
  Description: string;
}

export function generateMockUserTicketItem() {
  return {
    Description: 'MockDescription',
    CompanyInfo: generateMockCompanyDetail(),
    TicketDetail: generateMockTicketDetail()
  };
}
