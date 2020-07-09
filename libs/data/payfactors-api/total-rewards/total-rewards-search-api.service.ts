import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PayfactorsApiService } from '../payfactors-api.service';
import { MappingHelper } from '../../../core/helpers';

@Injectable()
export class TotalRewardsSearchApiService {
  private endpoint = 'TotalRewardsSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  searchEmployees(searchRequest: any) {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchEmployees`, searchRequest);
  }

  searchEmployeesAggregations(searchRequest: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchEmployeesAggregations`, searchRequest);
  }

  getAssignedEmployees(request: any): Observable<GridDataResult> {
    return this.payfactorsApiService.post<GridDataResult>(`${this.endpoint}/GetAssignedEmployees`, request, MappingHelper.mapListAreaResultToGridDataResult);
  }
}
