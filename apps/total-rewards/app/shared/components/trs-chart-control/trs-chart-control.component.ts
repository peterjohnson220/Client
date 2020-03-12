import { Component, Input, OnInit } from '@angular/core';

import { ChartControl } from '../../models/';

@Component({
  selector: 'pf-trs-chart-control',
  templateUrl: './trs-chart-control.component.html',
  styleUrls: ['./trs-chart-control.component.scss']
})
export class TrsChartControlComponent implements OnInit {

  @Input() controlData: ChartControl;
  @Input() companyColors;
  @Input() employee;

  constructor() { }

  ngOnInit() {
  }
  public labelContent(e: any): string {
    return e.value + 'k';
  }
}
