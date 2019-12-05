import { DatePipe } from '@angular/common';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions, isValueRequired } from './filter-operator-options-helpers';


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

// This function is not a reducer selector because we were seeing
// ExpressionChangedAfterItHasBeenCheckedError console errors when opening the split view template
export function getUserFilteredFields(fields: ViewField[]): ViewField[] {
  return fields && fields.length > 0 ? fields
    .filter(f => f.CustomFilterStrategy && !f.IsGlobalFilter)
    .concat(fields.filter(f => f.IsFilterable && f.IsSelectable))
    .filter(f => f.FilterValue || !isValueRequired(f))
    : [];
}
