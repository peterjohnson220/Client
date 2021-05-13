import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ViewField } from 'libs/models/payfactors-api';
import { Between } from 'libs/ui/formula-editor/models';

import { getHumanizedFilter, isValueRequired } from '../helpers';
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

  @Output() clearFilter: EventEmitter<{ field: ViewField, value: string }> = new EventEmitter();
  @Output() clearAllFilters = new EventEmitter();

  constructor() { }

  isBetweenOperator(operator: string) {
    return operator === Between.Value;
  }

  getPillDisplay(field: ViewField, filterValues: string[]): string {
    return getHumanizedFilter(field, filterValues, this.fieldsToShowFilterValueOnly, this.customFilterOptions);
  }

  pillClicked(field: ViewField, values: string[] = null) {
    const value = values != null && values.length > 0 ? values[0] : null;
    this.clearFilter.emit({field, value});
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
