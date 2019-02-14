import { Injectable } from '@angular/core';

import { of } from 'rxjs';

import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';

import { CompanyJob, ExchangeJob } from '../../../features/peer/job-association/models';

@Injectable()
export class JobAssociationApiService {
  constructor(private payfactorsApiService: PayfactorsApiService) { }

  loadExchangeJobs(listState: State) {
    const gridDataResult: GridDataResult = {
      data: [
        { Id: 1, JobFamily: 'Family A', JobTitle: 'Zookeeper', ExchangeName: 'Zoo' } as ExchangeJob,
        { Id: 2, JobFamily: 'Family B', JobTitle: 'Lion Trainer', ExchangeName: 'Zoo' } as ExchangeJob,
        { Id: 3, JobFamily: 'Family C', JobTitle: 'Custodian', ExchangeName: 'Zoo' } as ExchangeJob
      ],
      total: 3
    };
    return of(gridDataResult);

    // return this.payfactorsApiService.get<GridDataResult>(
    //   `${this.endpoint}`,
    //   { params: { listState: JSON.stringify(listState) } },
    //   MappingHelper.mapListAreaResultToGridDataResult
    // );
  }
}
