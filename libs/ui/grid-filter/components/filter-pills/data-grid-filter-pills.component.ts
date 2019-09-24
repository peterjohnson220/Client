import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DataGridService } from 'libs/features/pf-data-grid/services/data-grid.service';
import { PfDataGridFieldModel, PfGridFieldFilter } from 'libs/models/common/pf-data-grid';

@Component({
  selector: 'pf-data-grid-filter-pills',
  templateUrl: './data-grid-filter-pills.component.html',
  styleUrls: ['./data-grid-filter-pills.component.scss']
})
export class PfDataGridFilterPillsComponent {
  @Input() filters: PfGridFieldFilter[];
  @Input() listAreaColumns: PfDataGridFieldModel[];
  @Input() customListAreaColumns: PfDataGridFieldModel[];

  @Output() clearFilter = new EventEmitter();
  @Output() clearAllFilters = new EventEmitter();

  constructor(private gridService: DataGridService) { }

  getPillDisplay(filter: PfGridFieldFilter) {
    const columns: PfDataGridFieldModel[] = this.listAreaColumns.concat(this.customListAreaColumns);
    return this.gridService.getHumanizedFilter(columns, filter);
  }

  pillClicked(filter: PfGridFieldFilter) {
    this.clearFilter.emit(filter);
  }

  clearAll() {
    this.clearAllFilters.emit();
  }
}
