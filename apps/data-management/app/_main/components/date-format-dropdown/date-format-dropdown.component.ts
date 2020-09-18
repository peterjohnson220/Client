import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DATE_FORMATS } from 'libs/features/org-data-loader/constants';

@Component({
  selector: 'pf-date-format-dropdown',
  templateUrl: './date-format-dropdown.component.html',
  styleUrls: ['./date-format-dropdown.component.scss']
})
export class DateFormatDropDownComponent {

  @Input() provider: string;
  @Input() selectedDateFormat = '';

  @Output() handleDateFormatSelected = new EventEmitter();

  dateFormats: Array<{ text: string, value: string}> = DATE_FORMATS;

  constructor() {

  }
  onDateFormatSelected(event) {
    this.handleDateFormatSelected.emit(event.target.value);
  }
}
