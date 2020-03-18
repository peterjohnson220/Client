import { Component, Input, OnInit } from '@angular/core';

import { BaseControl } from '../../models';

@Component({
  selector: 'pf-trs-summary-control',
  templateUrl: './trs-summary-control.component.html',
  styleUrls: ['./trs-summary-control.component.scss']
})
export class TrsSummaryControlComponent implements OnInit {

  @Input() controlData: BaseControl;

  constructor() { }

  ngOnInit() {
  }
}
