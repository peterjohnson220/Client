import { Component, Input, OnInit } from '@angular/core';

import { BaseControl, Styling } from '../../models';
import { formatDefaultStyles } from '../../../../../../libs/core/functions/format-default-styles';

@Component({
  selector: 'pf-trs-summary-control',
  templateUrl: './trs-summary-control.component.html',
  styleUrls: ['./trs-summary-control.component.scss']
})
export class TrsSummaryControlComponent implements OnInit {

  @Input() controlData: BaseControl;
  @Input() titleStyles: Styling;

  constructor() { }

  ngOnInit() {
  }

  setDefaultStyling(style: Styling) {
    return formatDefaultStyles(style);
  }
}
