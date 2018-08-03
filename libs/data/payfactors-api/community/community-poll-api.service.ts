import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';

@Injectable()
export class CommunityPollApiService {
  private endpoint = 'CommunityPolls';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getAllCommunityPollRequests(): Observable<CommunityPollRequest[]> {
    return this.payfactorsApiService.get<CommunityPollRequest[]>(`${this.endpoint}/GetPollRequests`);
  }

  submitCommunityPollRequestResponse(payload: any): Observable<boolean> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SubmitResponse`, payload);
  }
}
