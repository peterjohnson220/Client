import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  UserTicketAttachmentDeleteRequest,
  UserTicketSearchRequest,
  UserTicketCommentRequest
} from 'libs/models/payfactors-api/service/request';
import {
  UserTicketCompanyDetailResponse, UserTicketResponse, UserTicketTypeResponse, UserTicketStateResponse
} from 'libs/models/payfactors-api/service/response';
import { PayfactorsApiService } from '../payfactors-api.service';
import { GenericKeyValue } from 'libs/models';

@Injectable()
export class UserTicketApiService {
  private endpoint = 'Ticket';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  createUserTicket(uploadData: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/CreateUserTicket`,
      { UserTicket: uploadData.UserTicket, FileData: uploadData.FileData });
  }

  searchUserTickets(request: UserTicketSearchRequest): Observable<UserTicketResponse[]> {
    return this.payfactorsApiService.post<UserTicketResponse[]>(`${this.endpoint}/Search`, request);
  }

  getUserTicket(ticketId: number): Observable<UserTicketResponse> {
    return this.payfactorsApiService.get<UserTicketResponse>(`${this.endpoint}/GetUserTicket/${ticketId}`);
  }

  getCompanyDetails(companyId: number): Observable<UserTicketCompanyDetailResponse> {
    return this.payfactorsApiService
      .get<UserTicketCompanyDetailResponse>(`${this.endpoint}/GetUserTicketDetailsByCompany/${companyId}`);
  }

  getUserTicketTypes(): Observable<UserTicketTypeResponse[]> {
    return this.payfactorsApiService.get<UserTicketTypeResponse[]>(`${this.endpoint}/GetUserTicketTypes`);
  }

  getUserTicketStates(): Observable<UserTicketStateResponse[]> {
    return this.payfactorsApiService.get<UserTicketStateResponse[]>(`${this.endpoint}/GetUserTicketStates`);
  }

  updateUserTicket(userTicketId: number, request: GenericKeyValue<string, string>[]) {
    return this.payfactorsApiService
      .post<UserTicketResponse>(`${this.endpoint}/UpdateUserTicket/${userTicketId}`, request);
  }

  deleteAttachment(request: UserTicketAttachmentDeleteRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}/DeleteAttachment/${request.UserTicketsFileId}`);
  }

  deleteComment(request: UserTicketCommentRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}/DeleteComment/${request.UserTicketsCommentId}`);
  }

  addComment(request: UserTicketCommentRequest) {
    return this.payfactorsApiService.postWithHeader(`${this.endpoint}/AddComment/${request.UserTicketId}`,
      JSON.stringify(request.Comments), this.headers);
  }

  updateComment(request: UserTicketCommentRequest) {
    return this.payfactorsApiService.postWithHeader(`${this.endpoint}/UpdateComment/${request.UserTicketsCommentId}`,
      JSON.stringify(request.Comments), this.headers);
  }
}
