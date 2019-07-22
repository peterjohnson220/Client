import { generateMockUserTicketType, UserTicketType } from './user-ticket-type.model';
import { generateMockTicketComment, TicketComment } from './ticket-comment.model';

export interface TicketDetail {
  TicketId: number;
  CompanyId: number;
  CompanyName: string;
  ServicesUserId?: number;
  EditDate: Date;
  CreateDate: Date;
  OpenedBy: string;
  UserTicketType: UserTicketType;
  TicketState: string;
  LastUpdatedText: string;
  TicketCssClass: string;
  Description: string;
  Comments: TicketComment[];
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
    TicketTypeDisplayName: 'MockTicketType - MockTicketSubType',
    TicketType: 'MockTicketType',
    TicketSubType: 'MockTicketSubType',
    TicketCssClass: 'MockTicketCssClass',
    TicketState: 'MockTicketState',
    LastUpdatedText: 'MockLastUpdatedText',
    Description: 'MockDescription',
    UserTicketType: generateMockUserTicketType(),
    Comments: [generateMockTicketComment()]
  };
}
