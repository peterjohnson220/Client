import { Injectable } from '@angular/core';

import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from 'libs/core/helpers';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';

@Injectable()
export class JobAssociationApiService {
  private endpoint = 'ExchangeCompany';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  loadExchangeJobs(listState: State) {
    return this.payfactorsApiService.get<GridDataResult>(
      `${this.endpoint}/GetExchangeJobsWithMappings`,
      { params: { exchangeId: -1, listState: JSON.stringify(listState) } },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }
}
