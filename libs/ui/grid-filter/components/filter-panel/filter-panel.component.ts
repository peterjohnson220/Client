import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { FilterDescriptor } from '@progress/kendo-data-query';

import { PfGridColumnModel } from 'libs/models/common/pf-grid';

import { FilterOperatorOptions } from '../../helpers/filter-operator-options/filter-operator-options';


@Component({
  selector: 'pf-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class GridFilterSidebarComponent implements OnChanges {
  @Input() selectedColumns: PfGridColumnModel[];
  @Input() nonSelectableFilterableColumns: PfGridColumnModel[];
  @Input('filters') set _filters(value: FilterDescriptor[]) {
    if (value) {
      this.filters = JSON.parse(JSON.stringify(value));
    }
  }

  @Output() saveFilterClicked = new EventEmitter();
  @Output() filterChanged = new EventEmitter();
  @Output() close = new EventEmitter();

  private listAreaColumnAssociatedFilter;
  private listAreaColumnCustomAssociatedFilter;
  public filters: FilterDescriptor[];
  // private filterOperatorOptions: FilterOperatorOptions;

  constructor() {}

  getFilterByListAreaColumn(listAreaColumn: PfGridColumnModel) {
    const emptyFilter = this.createEmptyFilterDescriptor(listAreaColumn);
    let currentFilter;

    if (this.filters) {
      currentFilter = this.filters.find(f => f.field === listAreaColumn.Field);

      // Since we break the binding of filters using a deep clone using JSON parse, JSON stringify
      // need to update any date fields values back to date objects.
      if (listAreaColumn.Type === 'date' && currentFilter && currentFilter.value) {
        currentFilter.value = new Date(currentFilter.value);
      }
    }

    return currentFilter || emptyFilter;
  }

  createEmptyFilterDescriptor(listAreaColumn: PfGridColumnModel): FilterDescriptor {
    let op = '';

    switch (listAreaColumn.Type) {
      case 'text':
        op = 'like';
        break;
      case 'date':
        op = '>=';
        break;
      case 'numeric':
        op = '=';
        break;
    }

    return {
      operator: op,
      field: listAreaColumn.Field,
      value: null
    };
  }

  handleFilterChanged(event) {
    let changedFilterIndex = -1;

    if (!this.filters) {
      this.filters = [];
    } else {
      changedFilterIndex = this.filters.findIndex(f => f.field === event.field);
    }

    if (changedFilterIndex !== -1) {
      if (this.filters[changedFilterIndex].value || this.valueCanBeEmptyOperator(this.filters[changedFilterIndex])) {
        this.filters[changedFilterIndex] = event;
      } else {
        this.filters.splice(changedFilterIndex, 1);
      }
    } else {
      this.filters.push(event);
    }

    this.filterChanged.emit(this.filters);
  }

  closeSidebar() {
    this.close.emit();
  }

  saveFilter() {
    this.saveFilterClicked.emit();
  }

  private valueCanBeEmptyOperator(filter: FilterDescriptor) {
    let isValueCanBeEmptyOperator = false;
    const fieldFound = this.selectedColumns.find(l => l.Field === filter.field);
    let fieldDataType;
    if (fieldFound) {
      fieldDataType = fieldFound.Type;
    } else {
      fieldDataType = 'text';
    }

    switch (fieldDataType) {
      case 'text':
        isValueCanBeEmptyOperator = !FilterOperatorOptions.Text.find(t => t.value === filter.operator).requiresValue;
        break;
      case 'date':
        isValueCanBeEmptyOperator = !FilterOperatorOptions.Date.find(t => t.value === filter.operator).requiresValue;
        break;
      case 'numeric':
        isValueCanBeEmptyOperator = !FilterOperatorOptions.Numeric.find(t => t.value === filter.operator).requiresValue;
        break;
    }

    return isValueCanBeEmptyOperator;
  }

  // Lifecycle
  ngOnChanges(changes: SimpleChanges) {
    this.listAreaColumnAssociatedFilter = [];
    this.listAreaColumnCustomAssociatedFilter = [];

    if (this.nonSelectableFilterableColumns) {
      for (const custom of this.nonSelectableFilterableColumns) {
        this.listAreaColumnCustomAssociatedFilter.push(this.getFilterByListAreaColumn(custom));
      }
    }

    if (this.selectedColumns) {
      for (const column of this.selectedColumns) {
        this.listAreaColumnAssociatedFilter.push(this.getFilterByListAreaColumn(column));
      }
    }
  }
}
