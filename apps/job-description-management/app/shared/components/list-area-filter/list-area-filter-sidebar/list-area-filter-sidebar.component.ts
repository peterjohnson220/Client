import {Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { FilterDescriptor } from '@progress/kendo-data-query';

import { ListAreaColumn } from 'libs/models/common';

import { DateOperatorOptions, NumericOperatorOptions, TextOperatorOptions, BooleanOperatorOptions
} from 'libs/features/job-description-management/models/list-area-options.model';

@Component({
  selector: 'pf-list-area-filter-sidebar',
  templateUrl: './list-area-filter-sidebar.component.html',
  styleUrls: ['./list-area-filter-sidebar.component.scss']
})
export class ListAreaFilterSidebarComponent implements OnChanges {
  @Input() customListAreaColumns: ListAreaColumn[];
  @Input('filters') set _filters(value: FilterDescriptor[]) {
    if (value) {
      this.filters = JSON.parse(JSON.stringify(value));
    }
  }
  @Input() listAreaColumns: ListAreaColumn[];
  @Input() saveFiltersVisible = true;

  @Output() saveFilterClicked = new EventEmitter();
  @Output() filterChanged = new EventEmitter();
  @Output() close = new EventEmitter();

  public filters: FilterDescriptor[];
  public listAreaColumnAssociatedFilter;
  public listAreaColumnCustomAssociatedFilter;

  constructor() {}

  ngOnChanges() {
      this.listAreaColumnCustomAssociatedFilter = this.customListAreaColumns.map(x => this.getFilterByListAreaColumn(x));
      this.listAreaColumnAssociatedFilter = this.listAreaColumns.map(x => this.getFilterByListAreaColumn(x));
  }

  getFilterByListAreaColumn(listAreaColumn: ListAreaColumn) {
    const emptyFilter = this.createEmptyFilterDescriptor(listAreaColumn);
    let currentFilter;

    if (this.filters) {
      currentFilter = this.filters.find(f => f.field === listAreaColumn.ColumnDatabaseName);

      // Since we break the binding of filters using a deep clone using JSON parse, JSON stringify
      // need to update any date fields values back to date objects.
      if (listAreaColumn.ColumnDataType === 'date' && currentFilter && currentFilter.value) {
        currentFilter.value = new Date(currentFilter.value);
      }

      if (listAreaColumn.ColumnDataType === 'numeric' && currentFilter && currentFilter.value) {
        currentFilter.value = Number(currentFilter.value);
      }

      if (listAreaColumn.ColumnDataType === 'boolean' && currentFilter && currentFilter.value) {
        currentFilter.value = JSON.parse(currentFilter.value);
      }
    }

    return currentFilter || emptyFilter;
  }

  createEmptyFilterDescriptor(listAreaColumn: ListAreaColumn): FilterDescriptor {
    let op = '';

    switch (listAreaColumn.ColumnDataType) {
      case 'text':
        op = 'contains';
        break;
      case 'date':
        op = 'gte';
        break;
      case 'numeric':
        op = 'eq';
        break;
      case 'boolean':
        op = 'eq';
        break;
    }

    return {
      operator: op,
      field: listAreaColumn.ColumnDatabaseName,
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
    const fieldFound = this.listAreaColumns.find(l => l.ColumnDatabaseName === filter.field);
    let fieldDataType;
    if (fieldFound) {
      fieldDataType = fieldFound.ColumnDataType;
    } else {
      fieldDataType = 'text';
    }

    switch (fieldDataType) {
      case 'text':
        isValueCanBeEmptyOperator = !TextOperatorOptions.find(t => t.value === filter.operator).checkValue;
        break;
      case 'date':
        isValueCanBeEmptyOperator = !DateOperatorOptions.find(t => t.value === filter.operator).checkValue;
        break;
      case 'numeric':
        isValueCanBeEmptyOperator = !NumericOperatorOptions.find(t => t.value === filter.operator).checkValue;
        break;
      case 'boolean':
        isValueCanBeEmptyOperator = !BooleanOperatorOptions.find(t => t.value === filter.operator).checkValue;
        break;
    }

    return isValueCanBeEmptyOperator;
  }
}
