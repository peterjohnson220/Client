import { Component, Input, Output, EventEmitter } from '@angular/core';
import {DatePipe} from '@angular/common';

import { ViewField, DataViewFilter, DataViewFieldDataType } from 'libs/models/payfactors-api/index';
import { FilterOperatorOptions } from '../helpers/filter-operator-options/filter-operator-options';

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
    return this.getHumanizedFilter(columns, filter);
  }

  pillClicked(filter: DataViewFilter) {
    this.clearFilter.emit(filter);
  }

  clearAll() {
    this.clearAllFilters.emit();
  }

  private getHumanizedFilter(columns: ViewField[], filter: DataViewFilter) {
    const field = columns.find(c => c.SourceName === filter.SourceName);
    if (field === null) {
      return `${filter.SourceName} ${filter.Operator} ${filter.Value}`;
    }

    const operatorDisplay = this.getOperatorDisplay(filter.Operator, field.DataType);
    const valueDisplay = this.getValueDisplay(filter.Value, field.DataType);
    return `${field.DisplayName} ${operatorDisplay} ${valueDisplay}`;
  }

  private getOperatorDisplay(operator: string, dataType: DataViewFieldDataType) {
    let display = '';
    switch (dataType) {
      case DataViewFieldDataType.String:
        display = FilterOperatorOptions.string.find(foo => foo.value === operator).display;
        break;
      case DataViewFieldDataType.Int:
        display = FilterOperatorOptions.int.find(foo => foo.value === operator).display;
        break;
      case DataViewFieldDataType.DateTime:
        display = FilterOperatorOptions.dateTime.find(foo => foo.value === operator).display;
        break;
      default:
        break;
    }
    return display;
  }

  private getValueDisplay(value: string, dataType: DataViewFieldDataType) {
    let display = value;

    switch (dataType) {
      case DataViewFieldDataType.DateTime:
        const dateFormatPipe = new DatePipe('en-US');
        display = dateFormatPipe.transform(display, 'MM/DD/YYYY');
        break;
    }
    return display;
  }
}
