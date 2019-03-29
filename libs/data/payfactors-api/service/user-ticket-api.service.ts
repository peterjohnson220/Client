import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UserTicketSearchRequest } from 'libs/models/payfactors-api/service/request';
import { UserTicketCompanyDetailResponse, UserTicketResponse } from 'libs/models/payfactors-api/service/response';
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
}
