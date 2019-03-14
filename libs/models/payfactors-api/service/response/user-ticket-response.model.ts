export interface UserTicketResponse {
  UserTicketId: number;
  CompanyId: number;
  UserId: number;
  UserTicketType: string;
  UserTicketState: string;
  UserTicket: string;
  ServicesUserId?: number;
  Priority?: number;
  CreateDate?: Date;
  FileType?: string;
  CompanyName: string;
  OpenedUserEmail: string;
  ServicesUserEmail?: string;
  EditDate?: Date;
  ClosedDate?: Date;
  UserTicketFiles?: UserTicketFile[];
  UserTicketComments?: UserTicketComment[];
}

export interface UserTicketFile {
  UserTicketsFileId: number;
  UserTicketId: number;
  DisplayName: string;
  FileName: string;
}

export interface UserTicketComment {
  UserTicketsCommentsId: number;
  UserTicketId: number;
  UserId: number;
  UserEmail: string;
  Comments?: string;
  CreateDate?: Date;
}

export function generateMockUserTicketViewModel(): UserTicketResponse {
  return {
    UserTicketId: 123,
    CompanyId: 13,
    UserId: 1234,
    UserTicketType: 'Question',
    UserTicketState: 'New',
    UserTicket: 'Hello',
    CompanyName: 'Test Company',
    OpenedUserEmail: 'test@hello.com'
  };
}

export function generateMockUserTicketsFile(): UserTicketFile {
  return {
    UserTicketsFileId: 1,
    UserTicketId: 1,
    DisplayName: 'my.pdf',
    FileName: 'my.pdf'
  };
}

export function generateMockUserTicketsComment(): UserTicketComment {
  return {
    UserTicketsCommentsId: 1,
    UserTicketId: 1,
    UserId: 123,
    UserEmail: 'test@hello.com',
    Comments: 'This is a comment.',
    CreateDate: new Date(2019, 3, 4)
  };
}

