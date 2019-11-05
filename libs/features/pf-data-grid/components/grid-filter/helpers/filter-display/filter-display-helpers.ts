import { DatePipe } from '@angular/common';

import { DataViewFieldDataType, DataViewFilter, ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions } from '../filter-operator-options/filter-operator-options';


export function getHumanizedFilter(columns: ViewField[], filter: DataViewFilter) {
  const field = columns.find(c => c.SourceName === filter.SourceName);
  if (field === null) {
    return `${filter.SourceName} ${filter.Operator} ${filter.Values[0]}`;
  }

  const operatorDisplay = getOperatorDisplay(filter.Operator, field.DataType);
  const valueDisplay = getValueDisplay(filter.Values[0], field.DataType);
  return `${field.DisplayName} ${operatorDisplay} ${valueDisplay}`;
}

export function getOperatorDisplay(operator: string, dataType: DataViewFieldDataType) {
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

export function getValueDisplay(value: string, dataType: DataViewFieldDataType) {
  let display = value;

  switch (dataType) {
    case DataViewFieldDataType.DateTime:
      const dateFormatPipe = new DatePipe('en-US');
      display = dateFormatPipe.transform(display, 'MM/DD/YYYY');
      break;
  }
  return display;
}


