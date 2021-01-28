import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { GetAssignedEmployeesResponse } from 'libs/models/payfactors-api/total-rewards';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class TotalRewardsSearchApiService {
  private endpoint = 'TotalRewardsSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  searchEmployees(searchRequest: any) {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchEmployees`, searchRequest);
  }

  searchUnassignedEmployees(searchRequest: any) {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchUnassignedEmployees`, searchRequest);
  }

  searchUnassignedEmployeesAggregations(searchRequest: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchUnassignedEmployeesAggregations`, searchRequest);
  }

  getAssignedEmployees(request: any): Observable<GetAssignedEmployeesResponse> {
    return this.payfactorsApiService.post<GetAssignedEmployeesResponse>(`${this.endpoint}/GetAssignedEmployees`, request);
  }
}
