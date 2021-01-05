import { UserTicketFile } from 'libs/models/payfactors-api/service/response';
import { Comment } from 'libs/ui/comment-box/models';

export interface UserTicket {
  TicketId: number;
  TicketSummary: string;
  TicketStatus: string;
  TicketType: string;
  TicketDetails: string;
  Attachments?: UserTicketFile[];
  Notes?: Comment[];
  NoteAccessLevel?: NoteAccessLevel;
  IsPrivate: boolean;
}

export enum NoteAccessLevel {
  ReadOnly = 'ReadOnly',
  Owner = 'Owner'
}

export enum AttachmentFileType {
  Word = 'Word',
  Excel = 'Excel',
  Pdf = 'Pdf',
  Image = 'Image',
  Unknown = 'Unknown'
}

export function generateMockUserTicket(): UserTicket {
  return {
    TicketId: 1,
    TicketSummary: 'Summary',
    TicketStatus: 'New',
    TicketType: 'Product Issue/Bug',
    TicketDetails: 'Here are my details',
    IsPrivate: false
  };
}
