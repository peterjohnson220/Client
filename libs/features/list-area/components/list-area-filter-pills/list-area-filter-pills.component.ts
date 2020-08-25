import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FilterDescriptor } from '@progress/kendo-data-query';

import { ListAreaColumn } from 'libs/models/common';

import { ListAreaService } from 'libs/core/services/list-area.service';

@Component({
  selector: 'pf-list-area-filter-pills',
  templateUrl: './list-area-filter-pills.component.html',
  styleUrls: ['./list-area-filter-pills.component.scss']
})
export class ListAreaFilterPillsComponent {
  @Input() filters: FilterDescriptor[];
  @Input() listAreaColumns: ListAreaColumn[];
  @Input() customListAreaColumns: ListAreaColumn[];

  @Output() clearFilter = new EventEmitter();
  @Output() clearAllFilters = new EventEmitter();

  constructor(private listAreaService: ListAreaService) { }

  getPillDisplay(filter: FilterDescriptor) {
    const columns: ListAreaColumn[] = this.listAreaColumns.concat(this.customListAreaColumns);
    return this.listAreaService.getHumanizedFilter(columns, filter);
  }

  pillClicked(filter: FilterDescriptor) {
    this.clearFilter.emit(filter);
  }

  clearAll() {
    this.clearAllFilters.emit();
  }
}
