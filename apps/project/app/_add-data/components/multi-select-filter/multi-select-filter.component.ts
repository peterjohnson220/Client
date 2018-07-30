import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MultiSelectFilter } from '../../models';

@Component({
  selector: 'pf-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss']
})
export class MultiSelectFilterComponent {
  @Input() filter: MultiSelectFilter;
  @Output() optionSelected: EventEmitter<{filterId: string, optionId: string}> = new EventEmitter();

  constructor() { }

  handleOptionSelected(filterId: string, optionId: string) {
    this.optionSelected.emit({ filterId, optionId });
  }
}
