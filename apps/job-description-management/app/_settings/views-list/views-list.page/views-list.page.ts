import { Component, OnInit, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { FilterableName } from 'libs/core/interfaces';
import { SimpleYesNoModalComponent } from 'libs/ui/common';
import { SimpleYesNoModalOptions } from 'libs/models/common';

import { JobDescriptionViewConstants } from '../../../shared/constants/job-description-view-constants';

import * as fromViewsListActions from '../actions/views-list.actions';
import * as fromViewsListReducer from '../reducers';

@Component({
  selector: 'pf-views-list-page',
  templateUrl: './views-list.page.html',
  styleUrls: ['./views-list.page.scss']
})
export class ViewsListPageComponent implements OnInit {
  @ViewChild(SimpleYesNoModalComponent, { static: true }) public deleteViewConfirmationModal: SimpleYesNoModalComponent;

  viewsListAsyncObj$: Observable<AsyncStateObj<FilterableName[]>>;
  viewsFilter: string;
  deleteViewModalOptions: SimpleYesNoModalOptions = {
    Title: 'Delete View',
    Body: '',
    ConfirmText: 'Yes',
    CancelText: 'No',
    IsDelete: true
  };

  constructor(
    private store: Store<fromViewsListReducer.State>
  ) {
    this.viewsListAsyncObj$ = this.store.pipe(select(fromViewsListReducer.getViewsListAsyncObj));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromViewsListActions.LoadJobDescriptionViews());
  }

  viewsTrackByFn(index: number, view: string) {
    return view;
  }

  isSystemView(viewName: string) {
    return JobDescriptionViewConstants.SYSTEM_VIEWS.indexOf(viewName) > -1;
  }

  handleSearchValueChanged(value: string) {
    this.viewsFilter = value;
  }

  handleViewDeleteConfirmed(viewName: string) {
    this.store.dispatch(new fromViewsListActions.DeleteView({viewName}));
  }

  deleteView(viewName: string) {
    this.deleteViewModalOptions.Body = `You are about to delete the <strong>${viewName}</strong> view. This cannot be undone. Would you like to continue?`;
    this.deleteViewConfirmationModal.open(viewName);
  }
}
