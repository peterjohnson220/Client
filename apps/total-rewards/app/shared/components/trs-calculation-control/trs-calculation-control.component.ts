import { Component, Input, OnInit } from '@angular/core';

import { CalculationControl } from '../../models';

@Component({
  selector: 'pf-trs-calculation-control',
  templateUrl: './trs-calculation-control.component.html',
  styleUrls: ['./trs-calculation-control.component.scss']
})
export class TrsCalculationControlComponent implements OnInit {

  @Input() controlData: CalculationControl;

  constructor() { }

  ngOnInit() {
  }

}
