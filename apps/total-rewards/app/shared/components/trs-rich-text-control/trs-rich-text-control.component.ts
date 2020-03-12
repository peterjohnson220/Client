import { Component, Input, OnInit } from '@angular/core';

import { formatDefaultStyles } from 'libs/core/functions/format-default-styles';

import { Styling, RichTextControl } from '../../models';

@Component({
  selector: 'pf-trs-rich-text-control',
  templateUrl: './trs-rich-text-control.component.html',
  styleUrls: ['./trs-rich-text-control.component.scss']
})
export class TrsRichTextControlComponent implements OnInit {

  @Input() controlData: RichTextControl;
  @Input() sectionTitlesStyles: Styling;
  @Input() dataStyles: Styling;

  constructor() { }

  ngOnInit() {
  }

  setDefaultStyling(style: Styling) {
    return formatDefaultStyles(style);
  }

}
