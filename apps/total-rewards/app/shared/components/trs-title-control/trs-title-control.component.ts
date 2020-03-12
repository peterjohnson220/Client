import { Component, Input, OnInit } from '@angular/core';

import { formatDefaultStyles } from 'libs/core/functions/format-default-styles';

import { BaseControl, Styling } from '../../models';


@Component({
  selector: 'pf-trs-title-control',
  templateUrl: './trs-title-control.component.html',
  styleUrls: ['./trs-title-control.component.scss']
})
export class TrsTitleControlComponent implements OnInit {

  @Input() controlData: BaseControl;
  @Input() titleStyles: Styling;

  constructor() { }

  ngOnInit() {
  }

  setDefaultStyling(style: Styling) {
    return formatDefaultStyles(style);
  }
}
