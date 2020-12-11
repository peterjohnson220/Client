import { Component, Input } from '@angular/core';
import { EmployeeControl, StatementModeEnum } from '../../models';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

@Component({
  selector: 'pf-trs-employee-control',
  templateUrl: './trs-employee-control.component.html',
  styleUrls: ['./trs-employee-control.component.scss'],
})
export class TrsEmployeeControlComponent {
  @Input() mode: StatementModeEnum;
  @Input() controlData: EmployeeControl;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() graphicsColors: string[];

  employeeNamePlaceHolder = 'EMPLOYEE NAME';
  employeeIdPlaceHolder = 'EMPLOYEE ID';

  get getEmployeeName(): string {
    let employeeName: string;
    if (this.mode === null) {
      employeeName = '';
    } else if (this.mode === StatementModeEnum.Edit) {
      employeeName = this.employeeNamePlaceHolder;
    } else {
      employeeName = this.getFormattedEmployeeName;
    }
    return employeeName;
  }

  get getFormattedEmployeeName(): string {
    if (!this.employeeRewardsData || (!this.employeeRewardsData?.EmployeeFirstName && !this.employeeRewardsData?.EmployeeLastName)) {
      return '';
    }
    let formattedName: string;
    if (this.employeeRewardsData.EmployeeFirstName) {
      formattedName = this.employeeRewardsData.EmployeeFirstName;
      if (this.employeeRewardsData.EmployeeLastName) {
        formattedName += ' ' + this.employeeRewardsData.EmployeeLastName;
      }
    } else {
      formattedName = this.employeeRewardsData.EmployeeLastName;
    }
    return formattedName;
  }

  get getEmployeeId(): string {
    let employeeId: string;
    if (this.mode === null) {
      employeeId = '';
    } else if (this.mode === StatementModeEnum.Edit) {
      employeeId = this.employeeIdPlaceHolder;
    } else {
      employeeId = this.getEmployeeIdFromEmployeeRewardsData;
    }
    return employeeId;
  }

  get getEmployeeIdFromEmployeeRewardsData(): string {
    let employeeId: string;
    if (!this.employeeRewardsData || !this.employeeRewardsData?.EmployeeId) {
      employeeId = '';
    } else {
      employeeId = this.employeeRewardsData.EmployeeId;
    }
    return employeeId;
  }
}
