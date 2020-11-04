import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement, StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';
import { StatementDownloadComponent } from 'libs/features/total-rewards/total-rewards-statement/components/statement-download';

@Component({
  selector: 'pf-total-rewards-statement-view',
  templateUrl: './statement-view.component.html',
  styleUrls: ['./statement-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatementViewComponent implements OnChanges {
  @ViewChild(StatementDownloadComponent) statementDownload: StatementDownloadComponent;
  @Input() statement: Statement;
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() showPayfactorsLogo = true;
  @Input() disableExport = false;
  @Input() generatingPdf = false;
  @Input() clientExport = false;
  @Output() downloadClicked: EventEmitter<any> = new EventEmitter<any>();
  mode = StatementModeEnum.Preview;
  statementTitle: string;
  currentDate: string;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.statement && !!this.employeeRewardsData) {
      this.statementTitle = this.getStatementTitle();
      this.currentDate = this.getCurrentDate();
    }
  }

  private getStatementTitle(): string {
    return this.statement.StatementName + ': ' +
      (
        (this.employeeRewardsData.EmployeeFirstName || this.employeeRewardsData.EmployeeLastName) ?
        this.employeeRewardsData.EmployeeFirstName + ' ' + this.employeeRewardsData.EmployeeLastName :
        this.employeeRewardsData.EmployeeId
      );
  }

  public downloadStatement(): void {
    if (this.clientExport) {
      // just for testing page only
      this.statementDownload.downloadPdf();
    }
    this.downloadClicked.emit();
  }

  private getCurrentDate(): string {
    return formatDate(new Date(), 'MM/dd/yyyy', 'en');
  }
}
