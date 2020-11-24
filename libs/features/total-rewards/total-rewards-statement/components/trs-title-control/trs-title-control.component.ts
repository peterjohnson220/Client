import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { StatementModeEnum, TitleControl, UpdateTitleRequest, TotalRewardsColorEnum } from '../../models';

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
  @Input() graphicsColors: string[];
  @Input() backgroundGraphicsEnabled;
  @Input() showEmployee;
  @Input() titleInnerWidth = '100%';

  @Output() titleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();

  modeEnum = StatementModeEnum;
  color = TotalRewardsColorEnum;

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
