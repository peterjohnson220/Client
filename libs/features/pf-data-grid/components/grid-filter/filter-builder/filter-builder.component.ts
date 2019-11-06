import { Input, Output, EventEmitter, Component } from '@angular/core';

import { DataViewFilter, DataViewFieldDataType } from 'libs/models/payfactors-api';

import { FilterOperatorOptions } from '../helpers/filter-operator-options/filter-operator-options';

@Component({
  selector: 'pf-filter-builder',
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.scss']
})

export class FilterBuilderComponent {
  @Input() disableDropdown = false;
  @Input() type: DataViewFieldDataType;
  @Input() filter: DataViewFilter;
  @Output() filterChanged = new EventEmitter<DataViewFilter>();

  private filterOperatorOptions = FilterOperatorOptions;
  public dataTypes = DataViewFieldDataType;
  public disableValue: boolean;

  handleFilterOperatorChanged(event) {
    this.filter.Operator = event;
    this.toggleValueInput();

    if (this.disableValue || (this.filter.Values[0] && this.filter.Values[0].toString().trim().length)) {
      this.filterChanged.emit(this.filter);
    }
  }

  handleFilterValueChanged(event) {
    this.filter.Values[0] = event;
    this.filterChanged.emit(this.filter);
  }

  private toggleValueInput() {
    const disabledValueOperators = this.filterOperatorOptions[this.type].filter(o => !o.requiresValue);
    if (disabledValueOperators.find(d => d.values[0] === this.filter.Operator)) {
      this.filter.Values[0] = '';
      this.disableValue = true;
    } else {
      this.disableValue = false;
    }
  }

  getFilterValue(filter: DataViewFilter) {
    return filter.Values && filter.Values.length > 0 ? filter.Values[0] : null;
  }
}
