import { TicketCommentLevel, UserTicketFile } from 'libs/models/payfactors-api/service/response';
import { Comment } from 'libs/features/comment-box/models';

export interface TicketComment extends Comment {
  TicketId: number;
  UserEmail?: string;
  Level?: TicketCommentLevel;
  AttachmentNames?: UserTicketFile[];
  CreateDateWithoutTime?: Date;
}

export function generateMockTicketComment(): TicketComment {
  return {
    TicketId: 1,
    CommentId: 1,
    UserEmail: 'MockUserTicketCommentEmail',
    FullName: 'MockCreatedUser',
    Content: 'MockComment',
    CreateDate: new Date()
  };
}
