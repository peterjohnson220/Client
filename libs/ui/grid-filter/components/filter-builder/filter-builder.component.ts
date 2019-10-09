import { Input, Output, EventEmitter, Component } from '@angular/core';

import { DataViewFilter, DataViewFieldDataType } from 'libs/models/payfactors-api';

import { FilterOperatorOptions } from '../../helpers/filter-operator-options/filter-operator-options';

@Component({
  selector: 'pf-filter-builder',
  templateUrl: './filter-builder.component.html'
})

export class FilterBuilderComponent {
  @Input() disableDropdown = false;
  @Input() type: DataViewFieldDataType;
  @Input() filter: DataViewFilter;
  @Output() filterChanged = new EventEmitter<DataViewFilter>();

  private filterOperatorOptions = FilterOperatorOptions;
  private dataTypes = DataViewFieldDataType;
  public disableValue: boolean;

  handleFilterOperatorChanged(event) {
    this.filter.Operator = event;
    this.toggleValueInput();

    if (this.disableValue || (this.filter.Value && this.filter.Value.toString().length)) {
      this.filterChanged.emit(this.filter);
    }
  }

  handleFilterValueChanged(event) {
    this.filter.Value = event;
    this.filterChanged.emit(this.filter);
  }

  private toggleValueInput() {
    const disabledValueOperators = this.filterOperatorOptions[this.type].filter(o => !o.requiresValue);
    if (disabledValueOperators.find(d => d.value === this.filter.Operator)) {
      this.filter.Value = '';
      this.disableValue = true;
    } else {
      this.disableValue = false;
    }
  }
}
