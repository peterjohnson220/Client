import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ViewField } from 'libs/models/payfactors-api';

import { getHumanizedFilter, isValueRequired } from '../helpers';

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

  @Output() clearFilter: EventEmitter<{field: ViewField, value: string}> = new EventEmitter();
  @Output() clearAllFilters = new EventEmitter();

  constructor() { }

  getPillDisplay(field: ViewField, filterValue: string): string {
    return getHumanizedFilter(field, filterValue, this.fieldsToShowFilterValueOnly);
  }

  pillClicked(field: ViewField, value = null) {
    this.clearFilter.emit({ field, value });
  }

  clearFilters() {
    this.clearAllFilters.emit();
  }

  getMaxWidthCalc() {
    return `calc(100vw - ${160 + this.widthOffset}px)`;
  }

  isValueRequired(field: ViewField): boolean {
    return isValueRequired(field);
  }
}
