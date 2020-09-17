import { Injectable } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { GenericNameValue } from 'libs/models/common';

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

  static get defaultAssignedEmployeesGridState(): { skip: number, take: number, filter: any, sort: any[] } {
    return {
      skip: 0,
      take: 20,
      filter: {
        filters: [],
        logic: 'and'
      },
      sort: []
    };
  }

  static mapSearchResults(results: EmployeeSearchResult[]): GenericNameValue<number>[] {
    return results.map(employee => {
      let displayName = '';
      if (employee.FirstName) {
        displayName += `${employee.FirstName} `;
      }
      if (employee.LastName) {
        displayName += `${employee.LastName} `;
      }
      if (employee.EmployeeId) {
        displayName += `(${employee.EmployeeId})`;
      }
      return {
        Value: employee.CompanyEmployeeId,
        Name: displayName
      };
    });
  }
}
