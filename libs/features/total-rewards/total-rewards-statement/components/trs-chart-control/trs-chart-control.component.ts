import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { LegendLabels } from '@progress/kendo-angular-charts';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { ChartControl, StatementModeEnum, UpdateTitleRequest, CalculationControl } from '../../models';
import { TotalRewardsStatementService } from '../../services/total-rewards-statement.service';
import { FontFamily } from '../../types';

@Component({
  selector: 'pf-trs-chart-control',
  templateUrl: './trs-chart-control.component.html',
  styleUrls: ['./trs-chart-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsChartControlComponent implements OnChanges {

  get inEditMode(): boolean {
    return this.mode === StatementModeEnum.Edit;
  }

  get inPrintMode(): boolean {
    return this.mode === StatementModeEnum.Print;
  }

  @Input() controlData: ChartControl;
  @Input() chartColors: string[];
  @Input() showChartSeriesLabels: boolean;
  @Input() showTitle: boolean;
  @Input() height: string;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() calculationControls: CalculationControl[];
  @Input() mode: StatementModeEnum;
  @Input() fontFamily: FontFamily;

  @Output() settingsClick = new EventEmitter();
  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() chartRender: EventEmitter<string> = new EventEmitter();

  chartData: { category: string, value: number }[];

  legendFont: LegendLabels = { font: 'inherit' };

  static getControlTitle (control: CalculationControl): string {
    return control.ShowTitle === true ?
      control.Title.Override || control.Title.Default :
      control.Summary.Override || control.Summary.Default;
  }

  ngOnChanges(changes: SimpleChanges) {
    // the chart animates on change detection, possibly because it thinks it's getting new values, so only change data when the mode changes
    if ((changes.mode && changes.mode.currentValue !== changes.mode.previousValue)
      || changes.employeeRewardsData || (changes.calculationControls?.currentValue !== changes.calculationControls?.previousValue && this.inEditMode)) {
      this.chartData = this.inEditMode ? this.getMockChartData() : this.getChartData();
    }

    if (changes.fontFamily) {
      const font = changes.fontFamily.currentValue;
      this.legendFont = font === 'Default' ? {font: 'inherit'} as LegendLabels : {font: '0.9rem ' + font} as LegendLabels;
    }
  }

  getChartData(): { category: string, value: number }[] {
    return this.calculationControls.map((c: CalculationControl) => {
      const sumOfVisibleFields = TotalRewardsStatementService.sumCalculationControlEmployerContribution(c, this.employeeRewardsData);
      const fractionDigits = sumOfVisibleFields < 500 ? 3 : 0;
      return {
        category: TrsChartControlComponent.getControlTitle(c),
        value: (sumOfVisibleFields) ? +(sumOfVisibleFields / 1000).toFixed(fractionDigits) : 0
      };
    });
  }

  getMockChartData(): { category: string, value: number }[] {
    const mockEditValues = [55, 10, 20, 10];
    return this.calculationControls.map((c: CalculationControl, i: number) => ({
      category: TrsChartControlComponent.getControlTitle(c), value: mockEditValues[i]
    }));
  }

  public labelContent(e: any): string {
    if (e.value < 1) {
      return '<1k';
    }
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
