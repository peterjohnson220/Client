import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { ChartControl, StatementModeEnum, UpdateTitleRequest, CalculationControl } from '../../models/';
import { TotalRewardsStatementService } from '../../services/total-rewards-statement.service';

@Component({
  selector: 'pf-trs-chart-control',
  templateUrl: './trs-chart-control.component.html',
  styleUrls: ['./trs-chart-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsChartControlComponent implements OnChanges {

  @Input() controlData: ChartControl;
  @Input() chartColors: string[];
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() calculationControls: CalculationControl[];
  @Input() mode: StatementModeEnum;

  @Output() settingsClick = new EventEmitter();
  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() chartRender: EventEmitter<string> = new EventEmitter();

  chartData: { category: string, value: number }[];

  get inEditMode(): boolean {
    return this.mode === StatementModeEnum.Edit;
  }

  get inPrintMode(): boolean {
    return this.mode === StatementModeEnum.Print;
  }

  ngOnChanges(changes: SimpleChanges) {
    // the chart animates on change detection, possibly because it thinks it's getting new values, so only change data when the mode changes
    if ((changes.mode && changes.mode.currentValue !== changes.mode.previousValue)
      || changes.employeeRewardsData || (changes.calculationControls?.currentValue !== changes.calculationControls?.previousValue && this.inEditMode)) {
      this.chartData = this.inEditMode ? this.getChartEditData() : this.getChartPreviewData();
    }
  }

  getChartPreviewData(): { category: string, value: number }[] {
    return this.calculationControls.map((c: CalculationControl) => {
      const sumOfVisibleFields = TotalRewardsStatementService.sumCalculationControl(c, this.employeeRewardsData);
      const divisor = sumOfVisibleFields < 1000 ? sumOfVisibleFields : 1000;
      return {
        category: c.Title.Override || c.Title.Default,
        value: (sumOfVisibleFields) ? +(sumOfVisibleFields / divisor).toFixed(0) : 0
      };
    });
  }

  getChartEditData(): { category: string, value: number }[] {
    const mockEditValues = [55, 10, 20, 10];
    return this.calculationControls.map((c: CalculationControl, i: number) => ({ category: c.Title.Override || c.Title.Default, value: mockEditValues[i] }));
  }

  public labelContent(e: any): string {
    return e.value + 'k';
  }

  onSettingsClick() {
    this.settingsClick.emit();
  }

  onControlTitleChange(newTitle: string) {
    this.onTitleChange.emit({ ControlId: this.controlData.Id, Title: newTitle });
  }

  onLegendItemClick($event: any) {
    $event.preventDefault();
  }

  onChartRender($event: any) {
    this.chartRender.emit(this.controlData.Id);
    this.onChartRender = () => ({});
  }
}
