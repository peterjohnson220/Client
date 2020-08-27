import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

import { TermsConditionsModel } from '../../../models/terms-conditions';
import { TermsConditionsSubmissionModel } from '../../../models/terms-conditions';


@Injectable({
  providedIn: 'root',
})
export class TermsConditionsApiService {
  private endpoint = 'TC';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getAwaitingTC(tcType: string): Observable<TermsConditionsModel> {
    return this.payfactorsApiService.get<TermsConditionsModel>
    (`${this.endpoint}.GetAwaitingTC`, { params: { tcType: tcType } }, (response) => JSON.parse(response.value));
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
