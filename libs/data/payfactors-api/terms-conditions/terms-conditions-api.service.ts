import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { PayfactorsApiService } from '../payfactors-api.service';

import { TermsConditionsModel } from '../../../models/terms-conditions';
import { TermsConditionsSubmissionModel } from '../../../models/terms-conditions/terms-conditions-submission.model';


@Injectable()
export class TermsConditionsApiService {
  private endpoint = 'TC';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getAwaitingTC(tcType: string): Observable<TermsConditionsModel> {
    return this.payfactorsApiService.get<TermsConditionsModel>
    (`${this.endpoint}.GetAwaitingTC`, { params: { tcType: tcType } });
  }

  postTermsConditionsResponse(userResponse: TermsConditionsSubmissionModel): Observable<any> {
    return this.payfactorsApiService.post<TermsConditionsSubmissionModel>(`${this.endpoint}.CreateTCResponse`,
      {
        TCId: userResponse.TCId,
        Accepted: userResponse.Accepted
      }
    );
  }

}
