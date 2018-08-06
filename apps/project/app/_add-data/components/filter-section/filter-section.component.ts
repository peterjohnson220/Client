import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Filter, isMultiFilter, isTextFilter } from '../../models';

@Component({
  selector: 'pf-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent {
  @Input() filter: Filter;
  @Output() reset: EventEmitter<string> = new EventEmitter();

  collapsed: boolean;

  constructor() {}

  get selectionCount(): number {
    return isMultiFilter(this.filter) ? this.filter.Options.filter(o => o.Selected).length : 0;
  }

  get hasText(): boolean {
    return isTextFilter(this.filter) ? this.filter.Value.length > 0 : false;
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }

  handleResetClicked(e, filterId: string) {
    e.stopPropagation();
    this.reset.emit(filterId);
  }
}
