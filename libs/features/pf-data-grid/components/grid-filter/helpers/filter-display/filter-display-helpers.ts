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
  return FilterOperatorOptions[dataType].find(foo => foo.value === operator).display;
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
