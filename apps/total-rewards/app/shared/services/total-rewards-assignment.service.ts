import { Injectable } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';

import { EmployeeSearchResult } from 'libs/models/payfactors-api/total-rewards/response';

@Injectable()
export class TotalRewardsAssignmentService {
  static setEmployeeSelectedToggle(employeeResults: EmployeeSearchResult[], selectedIds: number[]): EmployeeSearchResult[] {
    const employeesCopy = cloneDeep(employeeResults);
    employeesCopy.forEach(e => {
      if (selectedIds.indexOf(e.CompanyEmployeeId) !== -1) {
        e.IsSelected = true;
      }
    });

    return employeesCopy;
  }
}
