import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { IntlService } from '@progress/kendo-angular-intl';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';

import { FilterOperator, FilterOperatorOptions } from '../helpers';

@Component({
  selector: 'pf-filter-builder',
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.scss']
})

export class FilterBuilderComponent implements OnChanges {
  @Input() viewField: ViewField;
  @Input() filterTemplate: any;

  @Output() filterChanged = new EventEmitter<ViewField>();

  @ViewChild('numericInput') numericInputElement: NumericTextBoxComponent;

  INT_MAX = 2147483647; // c# int max
  field: ViewField;

  filterOperatorOptions = FilterOperatorOptions;
  dataTypes = DataViewFieldDataType;

  stringFilterOperators: FilterOperator[];
  bitFilterOptions = [{
    display: '',
    value: null
  }, {
    display: 'Yes',
    value: 'true'
  }, {
    display: 'No',
    value: 'false'
  }];

  constructor(private intlService: IntlService) {
    this.stringFilterOperators = this.filterOperatorOptions.string.filter(f => f.value !== 'in');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.viewField) {
      this.field = cloneDeep(this.viewField);
    }
  }

  handleFilterOperatorChanged(event) {
    this.field = cloneDeep(this.field);

    this.field.FilterOperator = event;

    if (this.valueCanBeEmpty() || (this.field.FilterValues?.length > 0)) {
      this.filterChanged.emit(this.field);
    }
  }

  handleFilterValueChanged(event: any) {
    if (this.field.DataType === DataViewFieldDataType.Int && event > this.INT_MAX) {
      this.field.FilterValues = [this.INT_MAX.toString()];
      this.numericInputElement.value = this.INT_MAX;
      this.numericInputElement.blur();
    } else if (this.field.DataType === DataViewFieldDataType.Int && event < 0) {
      this.field.FilterValues = ['0'];
      this.numericInputElement.value = 0;
      this.numericInputElement.blur();
    } else {
      this.field.FilterValues = event === null ? null : [event.toString()];
    }

    this.filterChanged.emit(this.field);
  }

  handleTextInputValueChanged(event: string): void {
    this.field.FilterValues = !!event && event.trim().length > 0 ? [event] : null;
    this.filterChanged.emit(this.field);
  }

  handleDatePickerValueChanged(event: Date): void {
    this.field.FilterValues = event !== null ? [this.intlService.formatDate(event, 'yyyy-MM-dd')] : null;
    this.filterChanged.emit(this.field);
  }

  getNumericFieldValue(): number {
    const filterValue = !!this.field?.FilterValues ? this.field.FilterValues[0] : null;
    return filterValue ? this.checkForIntMax(+filterValue) : null;
  }

  valueCanBeEmpty() {
    const disabledValueOperators: FilterOperator[] = this.filterOperatorOptions[this.field.DataType].filter((o: FilterOperator) => !o.requiresValue);
    if (disabledValueOperators.find(d => d.value === this.field.FilterOperator)) {
      this.field.FilterValues = null;
      return true;
    } else {
      return false;
    }
  }

  getDateTimeValue(): Date {
    const filterValue = !!this.field?.FilterValues ? this.field.FilterValues[0] : null;
    return (filterValue ? this.intlService.parseDate(filterValue) : null);
  }

  checkForIntMax(value: number): number {
    if (value > this.INT_MAX) {
      return this.INT_MAX;
    }
    return value;
  }

}
