import { Component, Input, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DataViewConfig, SimpleDataView } from 'libs/models/payfactors-api/index';

import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';

@Component({
  selector: 'pf-filter-chooser',
  templateUrl: './filter-chooser.component.html',
  styleUrls: ['./filter-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FilterChooserComponent implements OnInit {
  @Input() pageViewId: string;
  @Input() hideToggleButtons = false;
  @Input() filterSelectorDisplay = false;

  @ViewChild('popOver', { static: false }) public popOver: any;

  savedViews$: Observable<SimpleDataView[]>;
  viewDeleting$: Observable<boolean>;

  viewNameToBeDeleted: string;

  public filter: any;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnInit(): void {
    this.savedViews$ = this.store.select(fromReducer.getSavedViews, this.pageViewId);
    this.viewDeleting$ = this.store.select(fromReducer.getViewIsDeleting, this.pageViewId);
  }

  filterButtonClicked() {
    this.store.dispatch(new fromActions.ToggleFilterPanel(this.pageViewId));
  }

  resetFilterSelector() {
    this.viewNameToBeDeleted = '';
    this.filter = '';
  }


  handleViewSelected(view: DataViewConfig) {
    if (this.viewNameToBeDeleted) {
      return;
    }
    this.store.dispatch(new fromActions.HandleSavedViewClicked(this.pageViewId, view.Name));
    this.popOver.close();
  }

  cancelDelete() {
    this.viewNameToBeDeleted = '';
  }

  deleteView() {
    this.store.dispatch(new fromActions.DeleteSavedView(this.pageViewId, this.viewNameToBeDeleted));
    this.viewNameToBeDeleted = '';
  }

  trackByFn(index, item: SimpleDataView) {
    return item.Name;
  }
}
