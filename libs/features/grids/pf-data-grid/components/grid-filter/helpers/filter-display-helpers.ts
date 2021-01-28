import { DatePipe } from '@angular/common';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions, isValueRequired } from './filter-operator-options-helpers';

export function getHumanizedFilter(field: ViewField, filterValue: string, fieldsToShowValueOnly: string[] = []) {
  const operatorDisplay = getOperatorDisplay(field.FilterOperator, field.DataType);
  const valueDisplay = getValueDisplay(filterValue, field.DataType);
  if (fieldsToShowValueOnly?.includes(field.SourceName)) {
    return valueDisplay;
  } else {
    return `${field.DisplayName} ${operatorDisplay} ${valueDisplay}`;
  }
}

export function getSimpleDataViewDescription(field: ViewField): string {
  if (!!field?.FilterValues) {
    const descriptions = field.FilterValues.map(value => getHumanizedFilter(field, value));
    return descriptions.join(' • ');
  }
  return '';
}

export function getOperatorDisplay(operator: string, dataType: DataViewFieldDataType) {
  return FilterOperatorOptions[dataType].find(foo => foo.value === operator).display;
}

export function getValueDisplay(value: string, dataType: DataViewFieldDataType) {
  let display = value ?? '';

  switch (dataType) {
    case DataViewFieldDataType.DateTime: {
      const dateFormatPipe = new DatePipe('en-US');
      display = `${display}T00:00:00`;
      const isValidDate = !isNaN(Date.parse(display));
      display = isValidDate ? dateFormatPipe.transform(new Date(display), 'MM/dd/yyyy') : '';
      break;
    }
    case DataViewFieldDataType.Bit: {
      if (display && !!display.length) {
        display = display === 'true' ? 'Yes' : 'No';
      }
      break;
    }
  }
  return display;
}

// This function is not a reducer selector because we were seeing
// ExpressionChangedAfterItHasBeenCheckedError console errors when opening the split view template
export function getUserFilteredFields(filterableFields: ViewField[]): ViewField[] {

  const filteredFields = filterableFields.filter(f => !!f.FilterValues || !isValueRequired(f));

  return filteredFields.filter(f => f.CustomFilterStrategy && f.DataType !== DataViewFieldDataType.Bit)
    .concat(filteredFields.filter(f => f.DataType === DataViewFieldDataType.Bit))
    .concat(filteredFields.filter(f => f.DataType !== DataViewFieldDataType.Bit && !f.CustomFilterStrategy));
}
