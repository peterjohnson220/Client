import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';

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
  @Output() onFilterSidebarToggle = new EventEmitter();
  @Output() savedFiltersOpen = new EventEmitter();

  @ViewChild('p', { static: true }) public p: any;

  public filter: any;
  public filterSearchTerm: any;
  public attemptedDelete = false;
  public idDeleting: string = null;

  constructor() {}

  filterButtonClicked() {
    this.onFilterSidebarToggle.emit();
  }
}
