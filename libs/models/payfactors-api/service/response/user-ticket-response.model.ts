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
  OpenedUserId: number;
  ServicesUserEmail?: string;
  OpenedUserFullName: string;
  ServicesUserFullName?: string;
  TicketCssClass: string;
  LastUpdatedText: string;
  EditDate?: Date;
  ClosedDate?: Date;
  UserTicketFiles?: UserTicketFile[];
  UserTicketComments?: UserTicketComment[];
  UserTicketTypeId: number;
  TicketFileTypeId: number;
  UserTicketTypeSortOrder: number;
  TicketTitle?: string;
  HasNotes: boolean;
  UserModifiedDate?: Date;
}

export interface UserTicketFile {
  Id: number;
  UserTicketId: number;
  DisplayName: string;
  FileName: string;
  FileType?: string;
}

export interface UserTicketComment {
  UserTicketsCommentsId: number;
  UserTicketId: number;
  UserId: number;
  UserEmail: string;
  UserFullName: string;
  Comments?: string;
  CreateDate?: Date;
  Level?: TicketCommentLevel;
}

export enum TicketCommentLevel {
  Admin = 'Admin',
  User = 'User'
}

export function generateMockUserTicketViewModel(): UserTicketResponse {
  return {
    UserTicketId: 123,
    CompanyId: 13,
    UserId: 1234,
    UserTicketType: 'Question',
    TicketCssClass: 'questionColor',
    UserTicketState: 'New',
    UserTicket: 'Hello',
    CompanyName: 'Test Company',
    OpenedUserEmail: 'test@hello.com',
    OpenedUserFullName: 'Test Hello',
    OpenedUserId: 1,
    LastUpdatedText: '5 seconds ago',
    UserTicketTypeId: 1,
    TicketFileTypeId: 1,
    UserTicketTypeSortOrder: 1,
    HasNotes: false,
    UserModifiedDate: new Date('01/01/2020')
  };
}

export function generateMockUserTicketsFile(): UserTicketFile {
  return {
    Id: 1,
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
    UserFullName: 'mockUserFullName',
    Comments: 'This is a comment.',
    CreateDate: new Date(2019, 3, 4)
  };
}
