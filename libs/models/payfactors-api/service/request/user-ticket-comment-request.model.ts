export interface UserTicketCommentRequest {
  UserTicketsCommentId?: number;
  UserTicketId?: number;
  Comments?: string;
  ParentTicketCommentId?: number;
  Level?: string;
}

export function generateMockUserTicketCommentRequest(): UserTicketCommentRequest {
  return {
    UserTicketId: 1,
    UserTicketsCommentId: 1,
    Comments: 'MockComments'
  };
}

export function generateCreateNewMockUserTicketCommentRequest(): UserTicketCommentRequest {
  return {
    UserTicketId: 1,
    Comments: 'MockComments'
  };
}
