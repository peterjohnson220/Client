import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { IntlService } from '@progress/kendo-angular-intl';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';
import { Between } from 'libs/ui/formula-editor/models';

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

  datePickerValue = null;
  numericInputValue = null;

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

    // If operator changed from Between then we need to remove second value
    if (this.field.FilterOperator === Between.Value && this.field.FilterValues?.length === 2) {
      this.field.FilterValues.splice(1);
    }

    this.field.FilterOperator = event;

    // We want to emit for Between operator only when both values are presented
    if (this.valueCanBeEmpty() || this.filterValueValid()) {
      this.filterChanged.emit(this.field);
    }
  }

  handleFilterValueChanged(event: any) {
    this.field.FilterValues = event === null ? null : [event.toString()];
    this.filterChanged.emit(this.field);
  }

  // For Between operator we need to process differently
  handleFilterBetweenValueChanged(event: any, index: number) {
    if (event === null) {
      this.field.FilterValues[index] = null;
      if (this.field.FilterValues.every(element => element === null)) {
        this.field.FilterValues = null;
      }
    } else {
      if (this.field.FilterValues == null) {
        this.field.FilterValues = [];
      }
      this.field.FilterValues[index] = event.toString();
    }

    if (this.field.FilterValues == null || this.filterValueValid()) {
      this.filterChanged.emit(this.field);
    }
  }

  handleTextInputValueChanged(event: string): void {
    this.field.FilterValues = !!event && event.trim().length > 0 ? [event] : null;
    this.filterChanged.emit(this.field);
  }

  handleDatePickerValueChanged(event: Date): void {
    this.field.FilterValues = event !== null ? [this.intlService.formatDate(event, 'yyyy-MM-dd')] : null;
    this.filterChanged.emit(this.field);
  }

  getNumericFieldValue(index: number = 0): number {
    const filterValue = !!this.field?.FilterValues && this.field.FilterValues.length > index ? this.field.FilterValues[index] : null;
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

  private isBetweenOperator(operator: string) {
    return operator === Between.Value;
  }

  private filterValueValid() {
    return (this.field.FilterOperator !== Between.Value && this.field.FilterValues?.length > 0) ||
      (this.field.FilterOperator === Between.Value) && this.field.FilterValues?.length === 2 && this.field.FilterValues?.every(element => element !== null);
  }
}
