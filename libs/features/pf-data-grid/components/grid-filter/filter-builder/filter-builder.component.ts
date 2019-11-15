import { Input, Output, EventEmitter, Component, OnChanges, SimpleChanges } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';

import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';

import { FilterOperatorOptions } from '../helpers';


@Component({
  selector: 'pf-filter-builder',
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.scss']
})

export class FilterBuilderComponent implements OnChanges {


  @Input() viewField: ViewField;

  @Output() filterChanged = new EventEmitter<ViewField>();

  field: ViewField;

  private filterOperatorOptions = FilterOperatorOptions;
  public dataTypes = DataViewFieldDataType;

  ngOnChanges(changes: SimpleChanges) {
    if (this.viewField) {
      this.field = cloneDeep(this.viewField);
    }
  }

  handleFilterOperatorChanged(event) {
    this.field.FilterOperator = event;
    this.toggleValueInput();

    if (this.disableValue || (this.field.FilterValue && this.field.FilterValue.trim().length)) {
      this.filterChanged.emit(this.field);
    }
  }

  handleFilterValueChanged(event) {
    this.field.FilterValue = event;
    this.filterChanged.emit(this.field);
  }

  private toggleValueInput() {
    const disabledValueOperators = this.filterOperatorOptions[this.field.DataType].filter(o => !o.requiresValue);
    if (disabledValueOperators.find(d => d.values[0] === this.field.FilterOperator)) {
      this.field.FilterValue = '';
      this.disableValue = true;
    } else {
      return false;
    }
  }

}
