import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPoll } from 'libs/models/community/community-poll.model';
import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';
import { CommunityPollAddRequest } from '../../../models/community/community-poll-add-request.model';
import { CommunityPollResponseOption } from 'libs/models/community/community-poll-response-option.model';

@Injectable()
export class CommunityPollApiService {
  private endpoint = 'CommunityNew';

  constructor(
    // private store: Store<fromCommunityPollReducer.State>,
    private payfactorsApiService: PayfactorsApiService
  ) {}

  addCommunityPoll(communityPollAddRequest: CommunityPollAddRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.AddCommunityPoll`,
    {
      Question: communityPollAddRequest.Question,
      ResponseOptions: communityPollAddRequest.ResponseOptions
    });
  }

  getAllCommunityPolls(): Observable<CommunityPoll[]> {
    return this.payfactorsApiService.get<CommunityPoll[]>(`${this.endpoint}.GetAllCommunityPolls`);
  }

  getAllCommunityPollRequests(): Observable<CommunityPollRequest[]> {
    // TODO: add get to server
    const communityPollRequests = this.getPollRequests();

    return new Observable(o => {
      setTimeout(() => {
        o.next(communityPollRequests);
      }, 1000);
    });
  }

  submitCommunityPollRequestResponse(response: any): Observable<boolean> {
    // TODO: add get to server
    const success = true;
    return new Observable(o => {
      setTimeout(() => {
        o.next(success);
      }, 1000);
    });
  }

  getPollRequests() {
    const question1Opt1: CommunityPollResponseOption = { ResponseId: 1, ResponseText: 'Yes - with SAP/SuccessFactors' };
    const question1Opt2: CommunityPollResponseOption = { ResponseId: 2, ResponseText: 'Yes - with Oracle/Peoplesoft' };
    const question1Opt3: CommunityPollResponseOption = { ResponseId: 3, ResponseText: 'Yes - with UltimateSoftware' };
    const question1Opt4: CommunityPollResponseOption = {  ResponseId: 4, ResponseText: 'Yes - with Workday'  };
    const question1Opt5: CommunityPollResponseOption = {  ResponseId: 5, ResponseText: 'Yes - with ADP'  };
    const question1Opt6: CommunityPollResponseOption = {  ResponseId: 6, ResponseText: 'Yes - with another solution'  };

    const question1Opt7: CommunityPollResponseOption = { ResponseId: 7, ResponseText: 'No Interest'  };
    const question1: CommunityPollRequest = {
      CommunityPollId: 1,
      Question: 'Would you prefer a tighter integration between Payfactors and your System of Record?',
      DatePosted: new Date(),
      ResponseOptions: [question1Opt1, question1Opt2, question1Opt3, question1Opt4, question1Opt5, question1Opt6, question1Opt7],
      CreatedByUser: -1
    };
    const question2Opt1: CommunityPollResponseOption = { ResponseId: 1, ResponseText: 'None' };
    const question2Opt2: CommunityPollResponseOption = { ResponseId: 2, ResponseText: '< 1%' };
    const question2Opt3: CommunityPollResponseOption = { ResponseId: 3, ResponseText: '1% - 2%'};
    const question2Opt4: CommunityPollResponseOption = { ResponseId: 4, ResponseText: '2% - 3%'};
    const question2Opt5: CommunityPollResponseOption = { ResponseId: 5, ResponseText: '3% - 4%'};
    const question2Opt6: CommunityPollResponseOption = { ResponseId: 6, ResponseText: '4% - 5%'};
    const question2Opt7: CommunityPollResponseOption = { ResponseId: 7, ResponseText: '> 5%'};
    const question2: CommunityPollRequest = {
      CommunityPollId: 2,
      Question: 'What merit budget are you planning for 2018?',
      DatePosted: new Date(),
      ResponseOptions: [question2Opt1, question2Opt2, question2Opt3, question2Opt4, question2Opt5,
      question2Opt6, question2Opt7],
      CreatedByUser: -1
    };

    const requestQuestions: CommunityPollRequest[] = [question1, question2 ];

    return requestQuestions;
  }
}
