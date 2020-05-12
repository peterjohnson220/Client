import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { StatementModeEnum, TitleControl, UpdateTitleRequest, EmployeeRewardsData } from '../../models';

@Component({
  selector: 'pf-trs-title-control',
  templateUrl: './trs-title-control.component.html',
  styleUrls: ['./trs-title-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsTitleControlComponent {

  @Input() controlData: TitleControl;
  @Input() mode: StatementModeEnum;
  @Input() employeeRewardsData: EmployeeRewardsData;

  @Output() titleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();

  modeEnum = StatementModeEnum;

  get employeeName(): string {
    if (this.mode === StatementModeEnum.Edit) {
      return 'Employee Name';
    }

    return !this.employeeRewardsData ? '' : `${this.employeeRewardsData.EmployeeFirstName} ${this.employeeRewardsData.EmployeeLastName}`;
  }

  get employeeId(): string {
    if (this.mode === StatementModeEnum.Edit) {
      return 'Employee Id';
    }

    return !this.employeeRewardsData ? '' : this.employeeRewardsData.EmployeeId;
  }

  onTitleChange(title: string) {
    this.titleChange.emit({ControlId: this.controlData.Id, Title: title});
  }
}
