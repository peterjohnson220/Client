import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { formatDate } from '@angular/common';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement, StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';

@Component({
  selector: 'pf-total-rewards-statement-view',
  templateUrl: './statement-view.component.html',
  styleUrls: ['./statement-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatementViewComponent {
  @Input() statement: Statement;
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() employeeRewardsData: EmployeeRewardsData;
  mode = StatementModeEnum.Preview;
  printMode = StatementModeEnum.Print;

  constructor() { }

  get statementTitle(): string {
    return this.statement.StatementName + ': ' +
      (
        (this.employeeRewardsData.EmployeeFirstName || this.employeeRewardsData.EmployeeLastName) ?
        this.employeeRewardsData.EmployeeFirstName + ' ' + this.employeeRewardsData.EmployeeLastName :
        this.employeeRewardsData.EmployeeId
      );
  }

  get pdfFileName(): string {
    return (this.statement.StatementName + '_' +
      this.employeeRewardsData.EmployeeFirstName + '_' + this.employeeRewardsData.EmployeeLastName + '_' +
      formatDate(new Date(), 'MMMddyyyy', 'en')).replace(' ', '_');
  }

}
