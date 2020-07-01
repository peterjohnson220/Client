import { UserTicketComment } from '../response';

export class TicketCommentHelper {
  static mapUserTicketCommentWithReplyCount(allComments: UserTicketComment[]): UserTicketComment[] {
    const comments = allComments.filter(c => c.ParentTicketCommentId === null || c.ParentTicketCommentId === 0);
    const allReplies = allComments.filter(c => c.ParentTicketCommentId !== 0 && c.ParentTicketCommentId !== 0);
    const results = comments.map(c => {
      const replies = allReplies.filter(r => r.ParentTicketCommentId === c.UserTicketsCommentsId);
      return {
        ...c,
        ReplyCount: replies.length,
        Replies: replies
      };
    });
    return results;
  }
}
