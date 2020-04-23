import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ChartControl } from '../../models/';

@Component({
  selector: 'pf-trs-chart-control',
  templateUrl: './trs-chart-control.component.html',
  styleUrls: ['./trs-chart-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsChartControlComponent {

  @Input() controlData: ChartControl;
  @Input() chartColors: string[];
  @Input() employee;

  public labelContent(e: any): string {
    return e.value + 'k';
  }
}
