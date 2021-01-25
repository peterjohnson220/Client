import { Input, Output, EventEmitter, Component, OnChanges, SimpleChanges } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { IntlService } from '@progress/kendo-angular-intl';

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

    if (this.valueCanBeEmpty() || (this.field.FilterValues?.length > 0)) {
      this.filterChanged.emit(this.field);
    }
  }

  handleFilterValueChanged(event: any) {
    this.field.FilterValues = event === null ? null : [event.toString()];
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
    return filterValue ? +filterValue : null;
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

}
