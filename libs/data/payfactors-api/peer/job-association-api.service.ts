import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from 'libs/core/helpers';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { GenericMenuItem } from 'libs/models/common';

@Injectable()
export class JobAssociationApiService {
  private endpoint = 'ExchangeCompany';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  loadExchangeJobs(listState: State, jobTitleSearchTerm: string, jobFamilies: string[]): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(
      `${this.endpoint}/GetExchangeJobsWithMappings`,
      { params: { exchangeId: -1, listState: JSON.stringify(listState), jobTitleSearchTerm, jobFamilies: JSON.stringify(jobFamilies) } },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  loadJobFamilies(): Observable<GenericMenuItem[]> {
    return this.payfactorsApiService.get<GenericMenuItem[]>(`${this.endpoint}/GetExchangeJobFamilies`, {}, this.mapToGenericMenuItem);
  }

  mapToGenericMenuItem(jobFamilies: string[]) {
    return jobFamilies.map(f => ({ DisplayName: f, IsSelected: false, Id: null } as GenericMenuItem));
  }
}
