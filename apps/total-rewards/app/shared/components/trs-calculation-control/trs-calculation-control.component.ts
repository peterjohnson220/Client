import { Component, Input, OnInit } from '@angular/core';

import { formatDefaultStyles } from 'libs/core/functions/format-default-styles';

import { Styling, CalculationControl } from '../../models';

@Component({
  selector: 'pf-trs-calculation-control',
  templateUrl: './trs-calculation-control.component.html',
  styleUrls: ['./trs-calculation-control.component.scss']
})
export class TrsCalculationControlComponent implements OnInit {

  @Input() controlData: CalculationControl;
  @Input() sectionTitlesStyles: Styling;
  @Input() titlesStyles: Styling;
  @Input() dataStyles: Styling;
  @Input() calculationStyles: Styling;

  constructor() { }

  ngOnInit() {
  }

  setDefaultStyling(style: Styling) {
    return formatDefaultStyles(style);
  }
}
