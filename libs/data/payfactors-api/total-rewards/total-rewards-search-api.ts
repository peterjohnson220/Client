import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PayfactorsApiService } from '../payfactors-api.service';

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
}
