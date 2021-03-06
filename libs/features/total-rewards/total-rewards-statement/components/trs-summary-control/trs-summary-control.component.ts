import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { CalculationSummaryControl, CalculationControl, StatementModeEnum, UpdateTitleRequest } from '../../models';
import { TotalRewardsStatementService } from '../../services/total-rewards-statement.service';

@Component({
  selector: 'pf-trs-summary-control',
  templateUrl: './trs-summary-control.component.html',
  styleUrls: ['./trs-summary-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsSummaryControlComponent {

  @Input() mode: StatementModeEnum;
  @Input() controlData: CalculationSummaryControl;
  @Input() calculationControls: CalculationControl[];
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() graphicsColors: string[];
  @Input() showDecimals: boolean;

  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  constructor(public currencyPipe: CurrencyPipe) { }

  get isEditMode(): boolean {
    return this.mode === StatementModeEnum.Edit;
  }

  get isPreviewMode(): boolean {
    return this.mode === StatementModeEnum.Preview;
  }

  get editValue(): string {
    return this.currencyPipe.transform(0, this.employeeRewardsData?.Currency, 'symbol-narrow', this.currencyLocale).replace('0', '---,---');
  }

  get currencyLocale(): string {
    return this.showDecimals ? '1.2-2' : '1.0-0';
  }

  get sumOfCalculationControls(): string {
    let sum = 0;
    if (this.calculationControls) {
      sum = TotalRewardsStatementService.sumCalculationControls(this.calculationControls, this.employeeRewardsData);
    }
    return this.currencyPipe.transform(sum, this.employeeRewardsData?.Currency, 'symbol-narrow', this.currencyLocale);
  }

  handleTitleChanged(newTitle: string): void {
    this.onTitleChange.emit({ControlId: this.controlData.Id, Title: newTitle});
  }
}
