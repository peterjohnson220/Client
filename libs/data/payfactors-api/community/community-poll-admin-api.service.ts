import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPollList } from 'libs/models/community/community-poll-list.model';
import { CommunityPollUpsertRequest } from '../../../models/community/community-poll-upsert-request.model';

@Injectable({
  providedIn: 'root',
})
export class CommunityPollAdminApiService {
  private endpoint = 'CommunityPollsAdmin';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  addCommunityPoll(communityPollUsertRequest: CommunityPollUpsertRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.AddCommunityPoll`,
      {
        Question: communityPollUsertRequest.Question,
        ResponseOptions: communityPollUsertRequest.ResponseOptions
      });
  }

  editCommunityPoll(communityPollUsertRequest: CommunityPollUpsertRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.EditCommunityPoll`,
      {
        CommunityPollId: communityPollUsertRequest.CommunityPollId,
        Status: communityPollUsertRequest.Status,
        Question: communityPollUsertRequest.Question,
        ResponseOptions: communityPollUsertRequest.ResponseOptions
      });
  }

  getCommunityPolls(): Observable<CommunityPollList[]> {
    return this.payfactorsApiService.get<CommunityPollList[]>(`${this.endpoint}.GetCommunityPolls`);
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
