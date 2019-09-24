import { Input, Output, OnChanges, EventEmitter, Component } from '@angular/core';

import { cloneDeep } from 'lodash';

import { PfDataGridFieldModel, PfGridFieldFilter } from 'libs/models/common/pf-data-grid';

import { FilterOperatorOptions } from '../../helpers/filter-operator-options/filter-operator-options';

@Component({
  selector: 'pf-filter-builder',
  templateUrl: './filter-builder.component.html'
})

export class FilterBuilderComponent {
  @Input() disableDropdown = false;
  @Input() type: string;
  @Input() gridField: PfDataGridFieldModel;
  @Input() filter: PfGridFieldFilter;
  @Output() filterChanged = new EventEmitter<PfGridFieldFilter>();

  private filterOperatorOptions = FilterOperatorOptions;
  public disableValue: boolean;

  handleFilterOperatorChanged(event) {
    const newFilter = cloneDeep(this.filter);
    newFilter.Operator = event;

    this.filter = newFilter;
    this.toggleValueInput();

    if (this.disableValue || (this.filter.Value && this.filter.Value.toString().length)) {
      this.filterChanged.emit(this.filter);
    }
  }

  handleFilterValueChanged(event) {
    const newFilter = cloneDeep(this.filter);
    newFilter.Value = event;

    this.filter = newFilter;
    this.filterChanged.emit(this.filter);
  }

  /*ngOnChanges(changes) {
    if (changes.filter && changes.filter.currentValue) {
      this.toggleValueInput();
    }
  }*/

  /*ngOnInit() {
    this.filter = this.getFilterByListAreaColumn(this.gridField);
  }*/

  // TODO: case sensitivity on type. text -> Text
  private toggleValueInput() {
    if (this.type === 'template') {
      this.disableValue = false;
      return;
    }
    const disabledValueOperators = this.filterOperatorOptions[this.type].filter(o => !o.requiresValue);
    if (disabledValueOperators.find(d => d.value === this.filter.Operator)) {
      this.filter.Value = '';
      this.disableValue = true;
    } else {
      this.disableValue = false;
    }
  }
}
