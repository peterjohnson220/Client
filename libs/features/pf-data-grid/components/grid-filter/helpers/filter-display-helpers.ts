import { DatePipe } from '@angular/common';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions, isValueRequired } from './filter-operator-options-helpers';


export function getHumanizedFilter(field: ViewField) {
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
      display = `${display}T00:00:00`;
      const isValidDate = Date.parse(display) !== null;
      const dateValue = isValidDate ? new Date(display) : '';
      display = dateFormatPipe.transform(dateValue, 'MM/dd/yyyy');
      break;
  }
  return display;
}

// This function is not a reducer selector because we were seeing
// ExpressionChangedAfterItHasBeenCheckedError console errors when opening the split view template
export function getUserFilteredFields(filterableFields: ViewField[]): ViewField[] {

  const filteredFields = filterableFields.filter(f => f.FilterValue || !isValueRequired(f));

  return filteredFields.filter(f => f.CustomFilterStrategy && f.DataType !== DataViewFieldDataType.Bit)
    .concat(filteredFields.filter(f => f.DataType === DataViewFieldDataType.Bit))
    .concat(filteredFields.filter(f => f.DataType !== DataViewFieldDataType.Bit && !f.CustomFilterStrategy));
}
