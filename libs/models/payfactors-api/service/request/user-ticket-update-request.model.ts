import {UserTicketDto} from '../../../service';

export interface UserTicketUpdateRequest {
  UpdateFields: string[];
  UserTicket: UserTicketDto;
}

export function generateMockUserTicketUpdateRequest(): UserTicketUpdateRequest {
  return {
    UpdateFields: ['ServicesUserId'],
    UserTicket: {
      FileType: 'Organization Data',
      UserTicketType: 'File Upload',
      UserTicketState: 'Closed',
      ServicesUserId: 1,
      UserTicket: 'Hello',
      UserTicketId: 1
    }
  };
}
