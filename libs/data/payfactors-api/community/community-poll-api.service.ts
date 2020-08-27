import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';
import { CommunityPollResponse } from '../../../models/community/community-poll-response.model';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';
import { CommunityPost } from 'libs/models/community/community-post.model';

@Injectable({
  providedIn: 'root',
})
export class CommunityPollApiService {
  private endpoint = 'CommunityPolls';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getAllCommunityPollRequests(): Observable<CommunityPollRequest[]> {
    return this.payfactorsApiService.get<CommunityPollRequest[]>(`${this.endpoint}/GetPollRequests`);
  }

  getAllCommunityPollResponses(): Observable<CommunityPollResponse[]> {
    return this.payfactorsApiService.get<CommunityPollResponse[]>(`${this.endpoint}/GetPollResponses`);
  }

  submitCommunityPollRequestResponse(payload: any): Observable<boolean> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SubmitResponse`, payload);
  }

  dismissCommunityPollResponse(payload: string): Observable<boolean> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/DismissCommunityPollResponse`, payload);
  }

  addCommunityUserPoll(payload: any): Observable<CommunityPost> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddUserPoll`, payload);
  }

  exportCommunityUserPoll(communityPollId: string): Observable<any> {
    return this.payfactorsApiService.downloadFile(`${this.endpoint}/ExportCommunityUserPoll?communityPollId=${communityPollId}`);
  }
}
