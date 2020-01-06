import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';

import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

import { ListAreaColumn } from 'libs/models/common';
import { JdmListFilter } from 'libs/models/user-profile';

import { ListAreaService } from '../../../../shared/services/list-area.service';

@Component({
  selector: 'pf-filter-selector-popover',
  templateUrl: './filter-selector-popover.component.html',
  styleUrls: ['./filter-selector-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FilterSelectorPopoverComponent {
  @Input() userFilterList: JdmListFilter[];
  @Input() listAreaColumns: ListAreaColumn[];
  @Input() customListAreaColumns: ListAreaColumn[];
  @Input() loading: boolean;
  @Input() deleting: boolean;
  @Input() saveFiltersVisible = true;

  @Output() onFilterSelected = new EventEmitter();
  @Output() onFilterSidebarToggle = new EventEmitter();
  @Output() onDeleteConfirmed = new EventEmitter();
  @Output() open = new EventEmitter();

  @ViewChild('p', { static: false }) public p: any;

  public filter: any;
  public filterSearchTerm: any;
  public attemptedDelete = false;
  public idDeleting: string = null;

  constructor(private listAreaService: ListAreaService) {}

  filterButtonClicked() {
    this.onFilterSidebarToggle.emit();
  }

  displayFilterDescription(compositeFilter: CompositeFilterDescriptor) {
    // We must make this array of filters ambiguous because the CompositeFilterDescriptor interface types its 'filters' property as
    // Array<FilterDescriptor | CompositeFilterDescriptor>. And because the 'field' property exists only on the FilterDescriptor interface,
    // a compilation error occurs.
    const filters: any[] = compositeFilter.filters;
    const listAreaColumns = this.listAreaColumns.concat(this.customListAreaColumns);
    if (!listAreaColumns) {
      return '';
    }
    const humanizedFilters: string[] = filters.filter(f =>
      !!listAreaColumns.find(c => c.ColumnDatabaseName === f.field)).map(f =>
      this.listAreaService.getHumanizedFilter(listAreaColumns, f));

    return humanizedFilters.join(' • ');
  }

  selectFilter(selectedFilter: JdmListFilter) {
    if (this.attemptedDelete || this.deleting) {
      return;
    }

    this.onFilterSelected.emit(selectedFilter);
    this.p.close();
  }

  deleteFilter(id: string) {
    this.idDeleting = id;
    this.attemptedDelete = true;
  }

  confirmDelete() {
    this.attemptedDelete = false;
    if (this.idDeleting !== null) {
      this.onDeleteConfirmed.emit(this.idDeleting);
      this.idDeleting = null;
    }
  }

  cancelDelete() {
    this.attemptedDelete = false;
    this.idDeleting = null;
  }

  isDeleting(id: string) {
    return this.idDeleting === id;
  }
}
