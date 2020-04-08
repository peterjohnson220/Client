export interface UserTicketDto {
  UserTicketId?: number;
  ServicesUserId?: number;
  UserTicketType: string;
  UserTicketState: string;
  UserTicket: string;
  FileType: string;
  IsPrivate?: boolean;
  TicketTitle?: string;
}

export function generateMockUserTicketDto(): UserTicketDto {
  return {
    UserTicketType: 'UploadFiles',
    UserTicketState: 'New',
    UserTicket: 'This is a user ticket',
    FileType: 'Other'
  };
}
