import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ViewField } from 'libs/models/payfactors-api';

import { getHumanizedFilter } from '../helpers';
import { PfDataGridCustomFilterOptions } from '../../../models/pf-data-grid-custom-filter-options';

@Component({
  selector: 'pf-data-grid-filter-pills',
  templateUrl: './data-grid-filter-pills.component.html',
  styleUrls: ['./data-grid-filter-pills.component.scss']
})
export class PfDataGridFilterPillsComponent {

  @Input() fields: ViewField[];
  @Input() widthOffset = 0;
  @Input() lockedPillText: string;
  @Input() fieldsToShowFilterValueOnly: string[] = [];
  @Input() customFilterOptions: PfDataGridCustomFilterOptions[] = [];

  @Output() clearFilter = new EventEmitter();
  @Output() clearAllFilters = new EventEmitter();

  constructor() { }

  getPillDisplay(field: ViewField) {
    return getHumanizedFilter(field, this.fieldsToShowFilterValueOnly, this.customFilterOptions);
  }

  pillClicked(field: ViewField) {
    this.clearFilter.emit(field);
  }

  clearFilters() {
    this.clearAllFilters.emit();
  }

  getMaxWidthCalc() {
    return `calc(100vw - ${160 + this.widthOffset}px)`;
  }
}
