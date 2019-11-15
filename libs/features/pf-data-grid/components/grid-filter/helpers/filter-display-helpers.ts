import { DatePipe } from '@angular/common';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions } from './filter-operator-options-helpers';


export function getHumanizedFilter(field: ViewField) {
  if (field === null) {
    return `${field.SourceName} ${field.FilterOperator} ${field.FilterValue}`;
  }

  const operatorDisplay = getOperatorDisplay(field.FilterOperator, field.DataType);
  const valueDisplay = getValueDisplay(field.FilterValue, field.DataType);
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

