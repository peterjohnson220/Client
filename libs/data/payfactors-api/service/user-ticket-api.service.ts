import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  UserTicketAttachmentDeleteRequest,
  UserTicketSearchRequest,
  UserTicketCommentRequest,
  UserTicketCreateRequest
} from 'libs/models/payfactors-api/service/request';
import {
  UserTicketCompanyDetailResponse, UserTicketResponse, UserTicketTypeResponse, UserTicketStateResponse, SupportTeamResponse, UserTicketComment
} from 'libs/models/payfactors-api/service/response';
import { PayfactorsApiService } from '../payfactors-api.service';
import { GenericKeyValue } from 'libs/models';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Injectable()
export class UserTicketApiService {
  private endpoint = 'Ticket';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  createUserTicket(uploadData: UserTicketCreateRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/CreateUserTicket`,
      { UserTicket: uploadData.UserTicket, FileData: uploadData.FileData });
  }

  searchUserTickets(request: UserTicketSearchRequest): Observable<GridDataResult> {
    return this.payfactorsApiService.post<GridDataResult>(`${this.endpoint}/Search`, request);
  }

  getUserTicket(ticketId: number): Observable<UserTicketResponse> {
    return this.payfactorsApiService.get<UserTicketResponse>(`${this.endpoint}/GetUserTicket/${ticketId}`);
  }

  getUserTicketUserView(ticketId: number): Observable<UserTicketResponse> {
    return this.payfactorsApiService.get<UserTicketResponse>(`${this.endpoint}/GetUserTicketUserView/${ticketId}`);
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

  getUserDetail(userId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}/GetUserDetail/${userId}`);
  }

  getSupportTeam(): Observable<SupportTeamResponse[]> {
    return this.payfactorsApiService.get<SupportTeamResponse[]>(`${this.endpoint}/GetSupportTeam`);
  }

  addNote(request: UserTicketCommentRequest): Observable<UserTicketComment> {
    return this.payfactorsApiService.postWithHeader(`${this.endpoint}/AddNote/${request.UserTicketId}`,
      JSON.stringify(request.Comments), this.headers);
  }

}
