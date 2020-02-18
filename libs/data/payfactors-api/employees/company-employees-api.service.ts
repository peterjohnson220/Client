import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class CompanyEmployeesApiService {
  private endpoint = 'CompanyEmployee';
  constructor(private payfactorsApiService: PayfactorsApiService
  ) {}

  deleteEmployees(companyEmployeeIds: number[]): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.DeleteEmployees`, {
      CompanyEmployeeIds: companyEmployeeIds
    });
  }

}
