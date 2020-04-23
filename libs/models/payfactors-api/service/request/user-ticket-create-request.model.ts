import { UploadedFile, UserTicketDto } from '../../../service';

export interface UserTicketCreateRequest {
  UserTicket: UserTicketDto;
  FileData: UploadedFile[];
}
