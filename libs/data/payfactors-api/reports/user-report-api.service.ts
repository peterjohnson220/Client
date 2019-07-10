import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UpsertUserReportTag } from '../../../models/payfactors-api/reports/request';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class UserReportApiService {
  private endpoint = 'UserReport';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertUserReportTag(request: UpsertUserReportTag): Observable<any[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpsertUserReportTag`, request);
  }
}
