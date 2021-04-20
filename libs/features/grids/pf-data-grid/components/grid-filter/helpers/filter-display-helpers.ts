import { DatePipe } from '@angular/common';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';
import { Between } from 'libs/ui/formula-editor/models';

import { FilterOperatorOptions, isValueRequired } from './filter-operator-options-helpers';
import { PfDataGridCustomFilterOptions } from '../../../models/pf-data-grid-custom-filter-options';

export function getHumanizedFilter(field: ViewField, filterValues: string[],
                                   fieldsToShowValueOnly: string[] = [], customFilterOptions: PfDataGridCustomFilterOptions[] = []) {
  const customFilterDisplay = customFilterOptions.find(x => x.EntitySourceName === field.EntitySourceName && x.SourceName === field.SourceName);
  const fieldDataType = customFilterDisplay?.DataType ? customFilterDisplay.DataType : field.DataType;
  const fieldDisplayName = customFilterDisplay?.DisplayName ? customFilterDisplay.DisplayName : field.DisplayName;
  const fieldFilterOperator = customFilterDisplay?.FilterOperator ? customFilterDisplay.FilterOperator : field.FilterOperator;

  const operatorDisplay = getOperatorDisplay(fieldFilterOperator, fieldDataType);
  const valueDisplay = getValueDisplay(filterValues[0], fieldDataType, customFilterDisplay);

  if (fieldsToShowValueOnly?.includes(field.SourceName)) {
    return valueDisplay;
  } else {
    if (field.FilterOperator === Between.Value) {
      const secondValueDisplay = getValueDisplay(filterValues[1], fieldDataType, customFilterDisplay);
      return `${fieldDisplayName} ${operatorDisplay} ${valueDisplay} and ${secondValueDisplay}`;
    }

    return `${fieldDisplayName} ${operatorDisplay} ${valueDisplay}`;
  }
}

export function getSimpleDataViewDescription(field: ViewField, customFilterOptions: PfDataGridCustomFilterOptions[]): string {
  if (!!field?.FilterValues) {
    const descriptions = field.FilterValues.map(value => getHumanizedFilter(field, [value], [], customFilterOptions));
    return descriptions.join(' • ');
  }
  return '';
}

export function getOperatorDisplay(operator: string, dataType: DataViewFieldDataType) {
  return FilterOperatorOptions[dataType].find(foo => foo.value === operator).display;
}

export function getValueDisplay(filterValue: string, fieldDataType: DataViewFieldDataType, customFilterDisplay: PfDataGridCustomFilterOptions) {
  let display = filterValue ?? '';
  if (!!customFilterDisplay) {
    display = customFilterDisplay.FilterDisplayOptions.find(x => x.Value === filterValue)?.Display ?? filterValue;
  } else {
    switch (fieldDataType) {
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
