import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class OutboundJobsApiService {
  private endpoint = 'HrisJobDescriptionExport';

  constructor(private payfactorsApiService: PayfactorsApiService
  ) { }

  getLatestExportRuns() {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetLatestBulkExportRuns`);
  }
}
