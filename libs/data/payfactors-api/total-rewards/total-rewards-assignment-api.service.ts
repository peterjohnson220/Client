import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { Observable } from 'rxjs';
import { CompanyEmployee } from '../../../models/company';

@Injectable()
export class TotalRewardsAssignmentApiService {
  private endpoint = 'TotalRewardsAssignment';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  assignEmployees(request: any) {
    return this.payfactorsApiService.post(`${this.endpoint}/AssignEmployees`, request);
  }

  assignAllEmployees(searchRequest: any): Observable<number[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/AssignAllEmployees`, searchRequest);
  }

  unassignEmployees(request: any) {
    return this.payfactorsApiService.put(`${this.endpoint}/UnassignEmployees`, request);
  }
}
