import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../../payfactors-api.service';

@Injectable()
export class EmployeeSearchApiService {

  private endpoint = 'EmployeeSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getEmployeeResults(searchRequest: any) {
    return this.payfactorsApiService.post(`${this.endpoint}/GetEmployeeResults`, searchRequest);
  }
}
