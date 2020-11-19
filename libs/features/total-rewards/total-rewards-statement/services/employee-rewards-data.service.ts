import { Injectable } from '@angular/core';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';

@Injectable()
export class EmployeeRewardsDataService {
  static mapEmployeeRewardsDataDateFields(employeeRewards: EmployeeRewardsData): EmployeeRewardsData {
    if (employeeRewards.EmployeeDOH) {
      employeeRewards.EmployeeDOH = new Date(employeeRewards.EmployeeDOH);
    }
    if (employeeRewards.EmployeeDOB) {
      employeeRewards.EmployeeDOB = new Date(employeeRewards.EmployeeDOB);
    }
    return employeeRewards;
  }
}
