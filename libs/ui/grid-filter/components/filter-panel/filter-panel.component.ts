import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { ViewField, DataViewFilter } from 'libs/models/payfactors-api';
import { DataViewFieldDataType } from 'libs/models/payfactors-api/reports/request';
import { FilterOperatorOptions } from '../../helpers/filter-operator-options/filter-operator-options';


@Component({
  selector: 'pf-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnChanges {
  @Input('selectedColumns') set _selectedColumns(columns: ViewField[]) {
    this.selectedColumns = columns.filter(c => c.IsSelected);
  }
  @Input() nonSelectableFilterableColumns: ViewField[];
  @Input('filters') set _filters(value: DataViewFilter[]) {
    if (value) {
      this.filters = JSON.parse(JSON.stringify(value));
    }
  }

  @Output() saveFilterClicked = new EventEmitter();
  @Output() filterChanged = new EventEmitter<DataViewFilter>();
  @Output() filterCleared = new EventEmitter<DataViewFilter>();
  @Output() close = new EventEmitter();

  public selectedColumns: ViewField[];
  public filters: DataViewFilter[];

  private standardColumnFilters = [];

  constructor() {}

  closeSidebar() {
    this.close.emit();
  }

  saveFilter() {
    this.saveFilterClicked.emit();
  }

  handleFilterChange(event: DataViewFilter) {
    if ((event.Value && event.Value.length) || this.valueCanBeEmpty(event)) {
      this.filterChanged.emit(event);
    } else {
      this.filterCleared.emit(event);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.standardColumnFilters = [];
    if (this.selectedColumns) {
      for (const column of this.selectedColumns) {
        this.standardColumnFilters.push(this.getFilterByListAreaColumn(column));
      }
    }
  }

  private getFilterByListAreaColumn(viewField: ViewField) {
    const emptyFilter = this.createEmptyFilterDescriptor(viewField);
    let currentFilter;

    if (this.filters) {
      currentFilter = this.filters.find(f => f.SourceName === viewField.SourceName);

      // Since we break the binding of filters using a deep clone using JSON parse, JSON stringify
      // need to update any date fields values back to date objects.
      if (viewField.DataType === DataViewFieldDataType.DateTime && currentFilter && currentFilter.value) {
        currentFilter.value = new Date(currentFilter.value);
      }
    }

    return currentFilter || emptyFilter;
  }

  private createEmptyFilterDescriptor(viewField: ViewField): DataViewFilter {
    return {
      EntitySourceName: viewField.EntitySourceName,
      SourceName: viewField.SourceName,
      Operator: FilterOperatorOptions[viewField.DataType].find(f => f.defaultOperatorForType).value,
      Value: null,
      Values: [],
      DataType: viewField.DataType
    };
  }

  private valueCanBeEmpty(filter: DataViewFilter) {
   return !FilterOperatorOptions[filter.DataType].find(f => f.value === filter.Operator).requiresValue;
  }
}
