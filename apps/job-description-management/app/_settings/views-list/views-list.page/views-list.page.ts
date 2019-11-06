import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { FilterableName } from 'libs/core/interfaces';
import { SimpleYesNoModalComponent } from 'libs/ui/common';
import { SimpleYesNoModalOptions } from 'libs/models/common';

import * as fromViewEditActions from '../../view-edit/actions/view-edit.actions';
import * as fromViewsListActions from '../actions/views-list.actions';
import * as fromUpsertViewModalActions from '../actions/upsert-view-modal.actions';
import * as fromViewsListReducer from '../reducers';
import { JdmSettingsHelper } from '../../shared/helpers';

@Component({
  selector: 'pf-views-list-page',
  templateUrl: './views-list.page.html',
  styleUrls: ['./views-list.page.scss']
})
export class ViewsListPageComponent implements OnInit {
  @ViewChild(SimpleYesNoModalComponent, { static: true }) public deleteViewConfirmationModal: SimpleYesNoModalComponent;

  viewsListAsyncObj$: Observable<AsyncStateObj<FilterableName[]>>;
  viewsFilter: string;
  addView = true;
  deleteViewModalOptions: SimpleYesNoModalOptions = {
    Title: 'Delete View',
    Body: '',
    ConfirmText: 'Yes',
    CancelText: 'No',
    IsDelete: true
  };
  isSystemView = JdmSettingsHelper.isSystemView;

  constructor(
    private store: Store<fromViewsListReducer.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.viewsListAsyncObj$ = this.store.pipe(select(fromViewsListReducer.getViewsListAsyncObj));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromViewsListActions.LoadJobDescriptionViews());
  }

  viewsTrackByFn(index: number, view: string) {
    return view;
  }

  handleSearchValueChanged(value: string) {
    this.viewsFilter = value;
  }

  handleViewDeleteConfirmed(viewName: string) {
    this.store.dispatch(new fromViewsListActions.DeleteView({viewName}));
  }

  handleViewClicked(viewName: string) {
    this.store.dispatch(new fromViewEditActions.EditView({viewName}));
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  handleDeleteViewClicked(viewName: string, event: MouseEvent) {
    event.stopPropagation();

    if (this.isSystemView(viewName)) {
      return;
    }

    this.deleteViewModalOptions.Body = `You are about to delete the <strong>${viewName}</strong> view. This cannot be undone. Would you like to continue?`;
    this.deleteViewConfirmationModal.open(viewName);
  }

  openUpsertViewModal(addView: boolean, viewName: string, event: MouseEvent) {
    event.stopPropagation();
    this.addView = addView;
    this.store.dispatch(new fromUpsertViewModalActions.LoadAvailableTemplates());
    if (!addView) {
      this.store.dispatch(new fromUpsertViewModalActions.LoadJobDescriptionViews({ viewName: viewName }));
      this.store.dispatch(new fromUpsertViewModalActions.SetEditingViewName({ editingViewName: viewName }));
    }
    this.store.dispatch(new fromUpsertViewModalActions.OpenUpsertViewModal());
  }
}
