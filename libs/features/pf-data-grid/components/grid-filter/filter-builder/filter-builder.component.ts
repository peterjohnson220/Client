import { Input, Output, EventEmitter, Component, OnChanges, SimpleChanges } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';
import { IntlService } from '@progress/kendo-angular-intl';

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

  constructor(private intlService: IntlService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.viewField) {
      this.field = cloneDeep(this.viewField);
    }
  }

  handleFilterOperatorChanged(event) {
    this.field.FilterOperator = event;

    if (this.valueCanBeEmpty() || (this.field.FilterValue && this.field.FilterValue.toString().trim().length)) {
      this.filterChanged.emit(this.field);
    }
  }

  handleFilterValueChanged(event) {
    this.field.FilterValue = event === null ? event : event.toString();
    if (this.field.DataType === DataViewFieldDataType.DateTime) {
      this.field.FilterValue = this.intlService.formatDate(event, 'yyyy-MM-dd');
    }
    this.filterChanged.emit(this.field);
  }

  getNumericFieldValue(): number {
    return this.field.FilterValue ? +this.field.FilterValue : null;
  }

  valueCanBeEmpty() {
    const disabledValueOperators = this.filterOperatorOptions[this.field.DataType].filter(o => !o.requiresValue);
    if (disabledValueOperators.find(d => d.value === this.field.FilterOperator)) {
      this.field.FilterValue = '';
      return true;
    } else {
      return false;
    }
  }

  getDateTimeValue(): Date {
    return (this.field.FilterValue ? this.intlService.parseDate(this.field.FilterValue) : null);
  }

}
