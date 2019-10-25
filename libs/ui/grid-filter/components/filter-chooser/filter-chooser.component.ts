import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';

import { DataViewConfig } from 'libs/models/payfactors-api';
import { getHumanizedFilter } from '../../helpers/filter-display/filter-display-helpers';

@Component({
  selector: 'pf-filter-chooser',
  templateUrl: './filter-chooser.component.html',
  styleUrls: ['./filter-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FilterChooserComponent {
  @Input() loading: boolean;
  @Input() deleting: boolean;
  @Input() disabled = false;
  @Input() savedViews: DataViewConfig[] = [];
  @Output() onFilterSidebarToggle = new EventEmitter();
  @Output() savedFiltersOpen = new EventEmitter();
  @Output() selectView = new EventEmitter();

  @ViewChild('p', { static: true }) public p: any;

  public filter: any;
  public filterSearchTerm: any;
  public attemptedDelete = false;
  public idDeleting: string = null;

  constructor() {}

  filterButtonClicked() {
    this.onFilterSidebarToggle.emit();
  }

  displayFilterDescription(config: any) {
    const filters = config.Filters;

    if (!config.Fields) {
      return '';
    }

    const humanizedFilters: string[] = filters ? filters.filter(f =>
      !!config.Fields.find(c => c.SourceName === f.SourceName)).map(f =>
      getHumanizedFilter(config.Fields, f)) : [];

    return humanizedFilters.join(' • ');
  }

  handleViewSelected(view: DataViewConfig) {
    this.selectView.emit(view);
    this.p.close();
  }
}
