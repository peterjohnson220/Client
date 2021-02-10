import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { IntlService } from '@progress/kendo-angular-intl';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions } from '../helpers';

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

  constructor(private intlService: IntlService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['viewField']) {
      this.numericInputValue = null;
      this.field = cloneDeep(this.viewField);

      if (this.field.DataType === DataViewFieldDataType.DateTime) {
        this.datePickerValue = this.intlService.parseDate(this.field.FilterValue);
      }

      if (this.field.DataType === DataViewFieldDataType.Int && this.field.FilterValue) {
        this.numericInputValue = parseInt(this.field.FilterValue, 10);
      }

      if (this.field.DataType === DataViewFieldDataType.Float && this.field.FilterValue) {
        this.numericInputValue = parseFloat(this.field.FilterValue);
      }
    }
  }

  handleFilterOperatorChanged(event) {
    this.field = cloneDeep(this.field);

    this.field.FilterOperator = event;

    if (this.valueCanBeEmpty() || (this.field.FilterValue && this.field.FilterValue.toString().trim().length)) {
      this.filterChanged.emit(this.field);
    }
  }

  handleFilterValueChanged(event) {
    // prevent console errors when editing read only field
    this.field = cloneDeep(this.field);

    // check user input to ensure integer is not greater then c# max
    if (this.field.DataType === DataViewFieldDataType.Int && event > this.INT_MAX) {
      this.field.FilterValue = this.INT_MAX.toString();
      this.numericInputElement.value = this.INT_MAX;
      this.numericInputElement.blur();

    } else if (this.field.DataType === DataViewFieldDataType.Int && event < 0) {
      this.field.FilterValue = '0';
      this.numericInputElement.value = 0;
      this.numericInputElement.blur();

    } else if (this.field.DataType === DataViewFieldDataType.DateTime) {
      this.field.FilterValue = this.intlService.formatDate(event, 'yyyy-MM-dd');
    } else {
      this.field.FilterValue = event === null ? event : event.toString();
    }

    this.filterChanged.emit(this.field);
  }

  valueCanBeEmpty() {
    this.field = cloneDeep(this.field);

    const disabledValueOperators = this.filterOperatorOptions[this.field.DataType].filter(o => !o.requiresValue);
    if (disabledValueOperators.find(d => d.value === this.field.FilterOperator)) {
      this.field.FilterValue = '';
      return true;
    } else {
      return false;
    }
  }

}
