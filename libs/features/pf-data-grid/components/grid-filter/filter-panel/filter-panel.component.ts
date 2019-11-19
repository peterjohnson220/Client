import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions, getUserFilteredFields } from '../helpers';

@Component({
  selector: 'pf-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent {

  @Input() fields: ViewField[];

  @Output() saveFilterClicked = new EventEmitter();
  @Output() filterChanged = new EventEmitter<ViewField>();
  @Output() filterCleared = new EventEmitter<ViewField>();
  @Output() close = new EventEmitter();

  constructor() { }

  closeSidebar() {
    this.close.emit();
  }

  saveFilter() {
    this.saveFilterClicked.emit();
  }

  handleFilterChange(field: ViewField) {
    if (field.FilterValue || this.valueCanBeEmpty(field)) {
      this.filterChanged.emit(field);
    } else {
      this.filterCleared.emit(field);
    }
  }

  hasFilters(): boolean {
    return getUserFilteredFields(this.fields).length > 0;
  }

  trackByField(index, field: ViewField) {
    return field ? field.DataElementId : null;
  }

  private valueCanBeEmpty(field: ViewField) {
    return !FilterOperatorOptions[field.DataType].find(f => f.value === field.FilterOperator).requiresValue;
  }

}
