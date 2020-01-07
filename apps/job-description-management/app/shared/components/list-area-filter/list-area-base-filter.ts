import { Input, Output, OnChanges, EventEmitter } from '@angular/core';

import { FilterDescriptor } from '@progress/kendo-data-query';

import { FilterOperator } from '../../models/list-area-options.model';

export abstract class ListAreaBaseFilter implements OnChanges {
  @Input() filter: FilterDescriptor;
  @Input() disableDropdown = false;
  @Output() filterChanged = new EventEmitter();

  public abstract dropDownOptions: FilterOperator[];
  public abstract disableValueOperators: FilterOperator[];
  public disableValue: boolean;

  handleFilterOperatorChanged(event) {
    this.filter.operator = event;
    this.toggleValueInput();

    if (this.disableValue || (this.filter.value && this.filter.value.toString().length)) {
      this.filterChanged.emit(this.filter);
    }
  }

  handleFilterValueChanged(event) {
    if (event) {
      this.filter.value = event;
      this.filterChanged.emit(this.filter);
    }
  }

  ngOnChanges(changes) {
    if (changes.filter && changes.filter.currentValue) {
      this.toggleValueInput();
    }
  }

  private toggleValueInput() {
    if (this.disableValueOperators.find(d => d.value === this.filter.operator)) {
      this.filter.value = '';
      this.disableValue = true;
    } else {
      this.disableValue = false;
    }
  }
}
