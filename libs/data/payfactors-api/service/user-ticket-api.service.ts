import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  UserTicketAttachmentDeleteRequest,
  UserTicketSearchRequest,
  UserTicketUpdateRequest,
  UserTicketCommentRequest
} from 'libs/models/payfactors-api/service/request';
import {
  UserTicketCompanyDetailResponse, UserTicketResponse, UserTicketTypeResponse, UserTicketStateResponse
} from 'libs/models/payfactors-api/service/response';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class UserTicketApiService {
  private endpoint = 'UserTicket';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  createUserTicket(uploadData: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.CreateUserTicket`, uploadData);
  }

  searchUserTickets(request: UserTicketSearchRequest): Observable<UserTicketResponse[]> {
    return this.payfactorsApiService.post<UserTicketResponse[]>( `${this.endpoint}/Default.Search`, {
      UserTicketSearchRequest: request
    });
  }

  getUserTicket(ticketId: number): Observable<UserTicketResponse> {
    return this.payfactorsApiService.get<UserTicketResponse>( `${this.endpoint}(${ticketId})/Default.GetUserTicket`);
  }

  getCompanyDetails(companyId: number): Observable<UserTicketCompanyDetailResponse> {
    return this.payfactorsApiService
      .get<UserTicketCompanyDetailResponse>( `${this.endpoint}.GetUserTicketDetailsByCompany?companyId=${companyId}`);
  }

  getUserTicketTypes(): Observable<UserTicketTypeResponse[]> {
    return this.payfactorsApiService.get<UserTicketTypeResponse[]>(`${this.endpoint}.GetUserTicketTypes`);
  }

  getUserTicketStates(): Observable<UserTicketStateResponse[]> {
    return this.payfactorsApiService.get<UserTicketStateResponse[]>(`${this.endpoint}.GetUserTicketStates`);
  }

  updateUserTicket(request: UserTicketUpdateRequest) {
    return this.payfactorsApiService
      .post<UserTicketResponse>( `${this.endpoint}(${request.UserTicket.UserTicketId})/Default.UpdateUserTicket`, request);
  }

  deleteAttachment(request: UserTicketAttachmentDeleteRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}(${request.UserTicketId})/Default.DeleteAttachment`, {
      UserTicketsFileId: request.UserTicketsFileId
    });
  }

  deleteComment(request: UserTicketCommentRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}(${request.UserTicketId})/Default.DeleteComment`, {
      UserTicketsCommentId: request.UserTicketsCommentId
    });
  }

  addComment(request: UserTicketCommentRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}(${request.UserTicketId})/Default.AddComment`, {
      Comments: request.Comments
    });
  }

  updateComment(request: UserTicketCommentRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}(${request.UserTicketId})/Default.UpdateComment`, {
      Comments: request.Comments,
      UserTicketsCommentId: request.UserTicketsCommentId
    });
  }
}
