import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { PfDataGridFieldModel, PfGridFieldFilter } from 'libs/models/common/pf-data-grid';
import {DataViewType} from '../../../../models/common/pf-data-grid';


@Component({
  selector: 'pf-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent /*implements OnChanges*/ {
  @Input('selectedColumns') set _selectedColumns(columns: PfDataGridFieldModel[]) {
    this.selectedColumns = columns.filter(c => c.Visible);
  }
  @Input() nonSelectableFilterableColumns: PfDataGridFieldModel[];
  @Input('filters') set _filters(value: PfGridFieldFilter[]) {
    if (value) {
      this.filters = JSON.parse(JSON.stringify(value));
    }
  }

  @Output() saveFilterClicked = new EventEmitter();
  @Output() filterChanged = new EventEmitter<PfGridFieldFilter>();
  @Output() close = new EventEmitter();

  private selectedColumns: PfDataGridFieldModel[];
  public filters: PfGridFieldFilter[];

  constructor() {}

  closeSidebar() {
    this.close.emit();
  }

  saveFilter() {
    this.saveFilterClicked.emit();
  }

  handleFilterChange(event: PfGridFieldFilter) {
    this.filterChanged.emit(event);
  }

  private getFilterByListAreaColumn(listAreaColumn: PfDataGridFieldModel) {
    const emptyFilter = this.createEmptyFilterDescriptor(listAreaColumn);
    let currentFilter;

    if (this.filters) {
      currentFilter = this.filters.find(f => f.SourceName === listAreaColumn.Field);

      // Since we break the binding of filters using a deep clone using JSON parse, JSON stringify
      // need to update any date fields values back to date objects.
      if (listAreaColumn.Type === 'date' && currentFilter && currentFilter.value) {
        currentFilter.value = new Date(currentFilter.value);
      }
    }

    return currentFilter || emptyFilter;
  }

  private createEmptyFilterDescriptor(gridField: PfDataGridFieldModel): PfGridFieldFilter {
    let operator = '';
    switch (gridField.Type) {
      case 'text':
        operator = 'contains';
        break;
      case 'numeric':
        operator = 'eq';
        break;
      case 'date':
        operator = 'gte';
        break;
    }

    return {
      Operator: operator,
      Value: null,
      SourceName: gridField.Field,
      EntitySourceName: '',
      Values: [],
      DataViewType: this.getDataViewEnumTypeByField(gridField.Type)
    };
  }

  private getDataViewEnumTypeByField(fieldType: string): DataViewType {
    switch (fieldType) {
      case 'text':
        return DataViewType.String;
      case 'numeric':
        return DataViewType.Int; // TODO: float is also an option, should that be used
      case 'date':
        return DataViewType.DateTime;
      default:
        return DataViewType.String;
    }
  }
}
