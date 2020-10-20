import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement, StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';
import { StatementDownloadComponent } from 'libs/features/total-rewards/total-rewards-statement/components/statement-download';

@Component({
  selector: 'pf-total-rewards-statement-view',
  templateUrl: './statement-view.component.html',
  styleUrls: ['./statement-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatementViewComponent {
  @ViewChild(StatementDownloadComponent) statementDownload: StatementDownloadComponent;
  @Input() statement: Statement;
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() showPayfactorsLogo = true;
  mode = StatementModeEnum.Preview;

  constructor() { }

  get statementTitle(): string {
    return this.statement.StatementName + ': ' +
      (
        (this.employeeRewardsData.EmployeeFirstName || this.employeeRewardsData.EmployeeLastName) ?
        this.employeeRewardsData.EmployeeFirstName + ' ' + this.employeeRewardsData.EmployeeLastName :
        this.employeeRewardsData.EmployeeId
      );
  }

  public downloadStatement(): void {
    this.statementDownload.downloadPdf();
  }

}
