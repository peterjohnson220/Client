export interface UserTicketDto {
  UserTicketType: string;
  UserTicketState: string;
  UserTicket: string;
  FileType: string;
}

export function generateMockUserTicketDto(): UserTicketDto {
  return {
    UserTicketType: 'UploadFiles',
    UserTicketState: 'New',
    UserTicket: 'This is a user ticket',
    FileType: 'Other'
  };
}
