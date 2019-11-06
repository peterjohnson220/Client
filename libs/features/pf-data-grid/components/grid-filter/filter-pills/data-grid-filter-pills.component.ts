import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ViewField, DataViewFilter } from 'libs/models/payfactors-api';

import { getHumanizedFilter } from '../helpers/filter-display/filter-display-helpers';

@Component({
  selector: 'pf-data-grid-filter-pills',
  templateUrl: './data-grid-filter-pills.component.html',
  styleUrls: ['./data-grid-filter-pills.component.scss']
})
export class PfDataGridFilterPillsComponent {
  @Input() filters: DataViewFilter[];
  @Input() listAreaColumns: ViewField[];
  @Input() customListAreaColumns: ViewField[];

  @Output() clearFilter = new EventEmitter();
  @Output() clearAllFilters = new EventEmitter();

  constructor() { }

  getPillDisplay(filter: DataViewFilter) {
    const columns: ViewField[] = this.listAreaColumns.concat(this.customListAreaColumns);
    return getHumanizedFilter(columns, filter);
  }

  pillClicked(filter: DataViewFilter) {
    this.clearFilter.emit(filter);
  }

  clearAll() {
    this.clearAllFilters.emit();
  }
}
