import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ExportAssignedEmployeesRequest } from 'libs/models/payfactors-api';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class TotalRewardsAssignmentApiService {
  private endpoint = 'TotalRewardsAssignment';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  assignEmployees(request: any): Observable<number[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/AssignEmployees`, request);
  }

  assignAllEmployees(searchRequest: any): Observable<number[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/AssignAllEmployees`, searchRequest);
  }

  unassignEmployees(request: any): Observable<number[]> {
    return this.payfactorsApiService.put(`${this.endpoint}/UnassignEmployees`, request);
  }

  exportAssignedEmployees(request: ExportAssignedEmployeesRequest): Observable<string> {
    return this.payfactorsApiService.post(`${this.endpoint}/ExportEmployees`, request);
  }

  getRunningExport(): Observable<string> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetRunningExport`);
  }
}
