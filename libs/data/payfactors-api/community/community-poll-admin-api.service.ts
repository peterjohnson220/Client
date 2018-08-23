import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPollList } from 'libs/models/community/community-poll-list.model';
import { CommunityPollAddRequest } from '../../../models/community/community-poll-add-request.model';
import { CommunityPollUpdateStatusRequest } from '../../../models/community/community-poll-update-status-request.model';

@Injectable()
export class CommunityPollAdminApiService {
  private endpoint = 'CommunityPollsAdmin';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  addCommunityPoll(communityPollAddRequest: CommunityPollAddRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.AddCommunityPoll`,
      {
        Question: communityPollAddRequest.Question,
        ResponseOptions: communityPollAddRequest.ResponseOptions
      });
  }

  updateCommunityPollStatus(communityPollUpdateStatusRequest: CommunityPollUpdateStatusRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.UpdateCommunityPollStatus`,
      {
        CommunityPollId: communityPollUpdateStatusRequest.CommunityPollId,
        Status: communityPollUpdateStatusRequest.Status
      });
  }

  getAllCommunityPolls(): Observable<CommunityPollList[]> {
    return this.payfactorsApiService.get<CommunityPollList[]>(`${this.endpoint}.GetAllCommunityPolls`);
  }

  exportCommunityPoll(communityPollId: string): Observable<any> {
    return this.payfactorsApiService.get<any>
    (`${this.endpoint}.ExportCommunityPoll`, {
      params: { communityPollId: communityPollId },
      responseType: 'blob',
      observe: 'response'
    } );
  }
}
