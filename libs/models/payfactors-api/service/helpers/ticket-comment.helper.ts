import { orderBy } from 'lodash';

import { Comment } from 'libs/features/comment-box/models';

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

  static mapUserTicketCommentsToComments(userTicketComments: UserTicketComment[]): Comment[] {
    const commentsWithReplyCount = TicketCommentHelper.mapUserTicketCommentWithReplyCount(userTicketComments);
    return commentsWithReplyCount.map(utf => {
      return {
        CommentId: utf.UserTicketsCommentsId,
        FullName: utf.UserFullName,
        Content: utf.Comments,
        CreateDate: utf.CreateDate,
        ReplyCount: utf.ReplyCount,
        Replies: this.mapTicketCommentsToReplies(utf.Replies)
      };
    });
  }

  static mapNewlyAddedTicketCommentToComment(utf: UserTicketComment): Comment {
    return {
      CommentId: utf.UserTicketsCommentsId,
      FullName: utf.UserFullName,
      Content: utf.Comments,
      CreateDate: utf.CreateDate,
      ReplyCount: 0,
      Replies: []
    };
  }

  static mapTicketCommentsToReplies(userTicketComments: UserTicketComment[]): Comment[] {
    const replies = userTicketComments.map(utf => {
      return {
        Content: utf.Comments,
        CommentId: utf.UserTicketsCommentsId,
        FullName: utf.UserFullName,
        CreateDate: utf.CreateDate,
        ParentCommentId: utf.ParentTicketCommentId,
        CompanyName: utf.CompanyName
      };
    });
    const orderedReplies = orderBy(replies, ['CreateDate']);
    return orderedReplies;
  }
}
