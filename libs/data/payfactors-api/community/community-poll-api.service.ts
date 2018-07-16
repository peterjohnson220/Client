import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPoll } from '../../../models/community/community-poll.model';
import { CommunityPollRequest } from '../../../models/community/community-poll-request.model';
import { CommunityPollStatusEnum } from '../../../models/community/community-poll-status.enum';

@Injectable()
export class CommunityPollApiService {
  private endpoint = 'Community';

  constructor(
    // private store: Store<fromCommunityPollReducer.State>,
    private payfactorsApiService: PayfactorsApiService
  ) {}

  addCommunityPoll(communityPollRequest: CommunityPollRequest): Observable<any> {
    // TODO: return this.payfactorsApiService.post<any>(`${this.endpoint}/AddCommunityPoll`, communityPoll);

    const demoPoll: CommunityPoll = {
      CommunityPollId: 0,
      Question: communityPollRequest.Question,
      DatePosted: communityPollRequest.DatePosted,
      Status: CommunityPollStatusEnum.Live,
      NumberOfResponses: 0,
      CreatedByUser: -1
    };

    return new Observable(o => {
      setTimeout(() => {
          o.next(demoPoll);
     }, 1000);
    });
  }

  getAllCommunityPolls(): Observable<CommunityPoll[]> {
    // TODO: return this.payfactorsApiService.get<CommunityPoll[]>(`${this.endpoint}/GetAllCommunityPolls`);

    // TODO: Remove when back-end endpoint is implemented
      // TODO: Remove when back-end endpoint is implemented
      const demoPoll: CommunityPoll = {
      CommunityPollId: 0,
      CreatedByUser: -1,
      Question: 'This is a demo poll question',
      DatePosted: new Date(),
      Status: CommunityPollStatusEnum.Live,
      NumberOfResponses: 0
    };

    const demoPolls = [demoPoll];

    return new Observable(o => {
      setTimeout(() => {
          o.next(demoPolls);
     }, 1000);
    });
  }
}
