import { CompanyDetail, generateMockCompanyDetail } from './company-detail.model';
import { generateMockTicketAttachments, TicketAttachment } from './ticket-attachment.model';
import { generateMockTicketDetail, TicketDetail } from './ticket-detail.model';

export interface UserTicketItem {
  TicketInfo: TicketDetail;
  CompanyInfo: CompanyDetail;
  Attachments: TicketAttachment[];
}

export function generateMockUserTicketItem() {
  return {
    Description: 'MockDescription',
    CompanyInfo: generateMockCompanyDetail(),
    TicketDetail: generateMockTicketDetail(),
    Attachments: generateMockTicketAttachments()
  };
}
