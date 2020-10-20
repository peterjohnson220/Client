import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';

import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement, StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';

@Component({
  selector: 'pf-total-rewards-statement-download',
  templateUrl: './statement-download.component.html',
  styleUrls: ['./statement-download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatementDownloadComponent {
  @ViewChild(PDFExportComponent, { static: true }) pdf: PDFExportComponent;
  @Input() statement: Statement;
  @Input() employeeRewardsData: EmployeeRewardsData;

  printMode = StatementModeEnum.Print;

  constructor() { }

  private getDefaultPdfName(): string {
    return (this.statement.StatementName + '_' + this.getEmployeeDisplayName() + '_' +
      formatDate(new Date(), 'MMMddyyyy', 'en')).replace(' ', '_') + '.pdf';
  }

  public downloadPdf(fileName?: string): void {
    this.pdf.saveAs(fileName || this.getDefaultPdfName());
  }

  private getEmployeeDisplayName(): string {
    if (this.employeeRewardsData.EmployeeFirstName || this.employeeRewardsData.EmployeeLastName) {
      let employeeFullName = this.employeeRewardsData.EmployeeFirstName || '';
      if (this.employeeRewardsData.EmployeeLastName) {
        employeeFullName += `_${this.employeeRewardsData.EmployeeLastName}`;
      }
      return employeeFullName;
    } else {
      return this.employeeRewardsData.EmployeeId;
    }
  }

}
