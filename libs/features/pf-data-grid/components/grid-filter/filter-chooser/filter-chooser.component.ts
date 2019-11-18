import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';

import { DataViewConfig, SimpleDataView } from 'libs/models/payfactors-api/index';

@Component({
  selector: 'pf-filter-chooser',
  templateUrl: './filter-chooser.component.html',
  styleUrls: ['./filter-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FilterChooserComponent {
  @Input() disabled = false;
  @Input() savedViews: SimpleDataView[] = [];
  @Output() onFilterSidebarToggle = new EventEmitter();
  @Output() selectView = new EventEmitter();

  @ViewChild('p', { static: true }) public p: any;

  public filter: any;
  public attemptedDelete = false;
  public idDeleting: string = null;

  constructor() {}

  filterButtonClicked() {
    this.onFilterSidebarToggle.emit();
  }

  handleViewSelected(view: DataViewConfig) {
    this.selectView.emit(view);
    this.p.close();
  }
}
