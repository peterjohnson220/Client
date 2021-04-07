import { DatePipe } from '@angular/common';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions, isValueRequired } from './filter-operator-options-helpers';
import { PfDataGridCustomFilterOptions } from '../../../models/pf-data-grid-custom-filter-options';

export function getHumanizedFilter(field: ViewField, filterValue: string,
                                   fieldsToShowValueOnly: string[] = [], customFilterOptions: PfDataGridCustomFilterOptions[] = []) {
  const operatorDisplay = getOperatorDisplay(field.FilterOperator, field.DataType);
  const valueDisplay = getValueDisplay(filterValue, field, customFilterOptions);
  if (fieldsToShowValueOnly?.includes(field.SourceName)) {
    return valueDisplay;
  } else {
    return `${field.DisplayName} ${operatorDisplay} ${valueDisplay}`;
  }
}

export function getSimpleDataViewDescription(field: ViewField, customFilterOptions: PfDataGridCustomFilterOptions[]): string {
  if (!!field?.FilterValues) {
    const descriptions = field.FilterValues.map(value => getHumanizedFilter(field, value, [], customFilterOptions));
    return descriptions.join(' • ');
  }
  return '';
}

export function getOperatorDisplay(operator: string, dataType: DataViewFieldDataType) {
  return FilterOperatorOptions[dataType].find(foo => foo.value === operator).display;
}

export function getValueDisplay(filterValue: string, field: ViewField, customDisplayOptions: PfDataGridCustomFilterOptions[]) {
  let display = filterValue ?? '';
  const customFilterDisplay = customDisplayOptions.find(x => x.EntitySourceName === field.EntitySourceName && x.SourceName === field.SourceName);
  if (!!customFilterDisplay) {
    display = customFilterDisplay.FilterDisplayOptions.find(x => x.Value === filterValue).Display;
  } else {
    switch (field.DataType) {
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
      }
    }
  }

  return display;
}

// This function is not a reducer selector because we were seeing
// ExpressionChangedAfterItHasBeenCheckedError console errors when opening the split view template
export function getUserFilteredFields(filterableFields: ViewField[], fieldsWithCustomTemplates: string[]): ViewField[] {
  const filteredFields = filterableFields.filter(f => !!f.FilterValues || !isValueRequired(f));

  return filteredFields.filter(f => f.CustomFilterStrategy || fieldsWithCustomTemplates.indexOf(f.SourceName) > -1)
    .concat(filteredFields.filter(f => f.DataType === DataViewFieldDataType.Bit
      && !(f.CustomFilterStrategy || fieldsWithCustomTemplates.indexOf(f.SourceName) > -1)))
    .concat(filteredFields.filter(f => f.DataType !== DataViewFieldDataType.Bit
      && !(f.CustomFilterStrategy || fieldsWithCustomTemplates.indexOf(f.SourceName) > -1)));
}
