export interface Comment {
  Content: string;
  CommentId?: number;
  FullName?: string;
  CompanyName?: string;
  ReplyCount?: number;
  Replies?: Comment[];
  CreateDate?: Date;
  ParentCommentId?: number;
}
