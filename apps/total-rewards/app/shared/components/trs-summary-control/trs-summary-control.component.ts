import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {CalculationSummaryControl} from '../../models/calculation-summary-control';

@Component({
  selector: 'pf-trs-summary-control',
  templateUrl: './trs-summary-control.component.html',
  styleUrls: ['./trs-summary-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsSummaryControlComponent implements OnInit {

  @Input() controlData: CalculationSummaryControl;

  constructor() { }

  ngOnInit() {
  }
}
