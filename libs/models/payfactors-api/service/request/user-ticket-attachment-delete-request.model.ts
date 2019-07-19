export interface UserTicketAttachmentDeleteRequest {
  UserTicketsFileId: number;
  UserTicketId: number;
}

export function generateUserTicketAttachmentDeleteRequest(): UserTicketAttachmentDeleteRequest {
  return {
    UserTicketId: 1,
    UserTicketsFileId: 2
  };
}
