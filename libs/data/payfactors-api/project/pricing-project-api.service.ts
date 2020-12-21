// This service is for the EF Core PricingProjectController used for the projects page re-write.
// The legacy services will still remain intact

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class PricingProjectApiService {
  private endpoint = 'PricingProject';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  togglePinToDashboard(projectId: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/TogglePinToDashboard`, projectId);
  }

  copyProject(projectId: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/CopyProject`, projectId);
  }
}

