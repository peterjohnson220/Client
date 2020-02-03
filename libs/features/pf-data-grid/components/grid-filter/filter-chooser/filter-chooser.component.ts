import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { DataViewConfig, SimpleDataView } from 'libs/models/payfactors-api/index';

@Component({
  selector: 'pf-filter-chooser',
  templateUrl: './filter-chooser.component.html',
  styleUrls: ['./filter-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FilterChooserComponent implements OnChanges {
  @Input() disabled = false;
  @Input() savedViews: SimpleDataView[] = [];
  @Input() viewDeleting = false;
  @Input() viewNameToBeDeleted: string;
  @Output() onFilterSidebarToggle = new EventEmitter();
  @Output() selectView = new EventEmitter();
  @Output() prepareViewForDelete = new EventEmitter();
  @Output() deleteViewEvent = new EventEmitter();
  @Output() cancelDeleteEvent = new EventEmitter();

  @ViewChild('p', { static: true }) public p: any;

  public filter: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['savedViews']) {
      const oldCollection = changes['savedViews'].previousValue;
      const newCollection = changes['savedViews'].currentValue;

      if ((oldCollection && oldCollection.length) && (newCollection && !newCollection.length)) {
        this.p.close();
      }
    }
  }

  filterButtonClicked() {
    this.onFilterSidebarToggle.emit();
  }

  handleViewSelected(view: DataViewConfig) {
    if (this.viewNameToBeDeleted) {
      return;
    }
    this.selectView.emit(view);
    this.p.close();
  }

  deleteView(viewName: string) {
    this.prepareViewForDelete.emit(viewName);
  }

  cancelDelete() {
    this.cancelDeleteEvent.emit();
  }

  confirmDeleteView() {
    this.deleteViewEvent.emit(this.viewNameToBeDeleted);
  }

  trackByFn(index, item: SimpleDataView) {
    return item.Name;
  }
}
