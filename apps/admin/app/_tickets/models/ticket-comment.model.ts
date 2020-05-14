import { TicketCommentLevel } from 'libs/models/payfactors-api/service/response';

export interface TicketComment {
    TicketId: number;
    UserTicketsCommentsId?: number;
    UserEmail?: string;
    UserFullName?: string;
    Comments?: string;
    CreateDate?: Date;
    Level?: TicketCommentLevel;
  }

  export function generateMockTicketComment(): TicketComment {
      return {
          TicketId: 1,
          UserTicketsCommentsId: 1,
          UserEmail: 'MockUserTicketCommentEmail',
          UserFullName: 'MockCreatedUser',
          Comments: 'MockComment',
          CreateDate: new Date()
      };
  }
