import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MultiSelectFilter, MultiSelectOption } from '../../models';

@Component({
  selector: 'pf-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss']
})
export class MultiSelectFilterComponent {
  @Input() filter: MultiSelectFilter;
  @Output() optionSelected: EventEmitter<{filterId: string, optionId: string}> = new EventEmitter();

  constructor() { }

  optionDisabled(option: MultiSelectOption) {
    return !option.Selected && option.Count === 0;
  }

  handleOptionSelected(filterId: string, option: MultiSelectOption) {
    if (this.optionDisabled(option)) {
      return;
    }
    this.optionSelected.emit({ filterId, optionId: option.Id });
  }
}
