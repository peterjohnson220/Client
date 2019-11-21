import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';

import * as fromViewEditActions from '../actions/view-edit.actions';
import * as fromViewEditReducer from '../reducers';
import { ControlViewToggleObj } from '../models';

@Component({
  selector: 'pf-view-edit-page',
  templateUrl: './view-edit.page.html',
  styleUrls: ['./view-edit.page.scss']
})
export class ViewEditPageComponent implements OnDestroy {
  viewName$: Observable<string>;
  templateViewsAsyncObj$: Observable<AsyncStateObj<any[]>>;
  saving$: Observable<boolean>;

  constructor(
    private store: Store<fromViewEditReducer.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.viewName$ = this.store.pipe(select(fromViewEditReducer.getViewEditViewName));
    this.templateViewsAsyncObj$ = this.store.pipe(select(fromViewEditReducer.getViewEditTemplateViewsAsyncObj));
    this.saving$ = this.store.pipe(select(fromViewEditReducer.getViewEditSaving));
  }

  handleCancelClicked() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  handleSaveClicked() {
    this.store.dispatch(new fromViewEditActions.SaveTemplateViews());
  }

  handleHiddenElementIdAdded(controlViewToggleObj: ControlViewToggleObj) {
    this.store.dispatch(new fromViewEditActions.AddHiddenElementId(controlViewToggleObj));
  }

  handleHiddenElementIdRemoved(controlViewToggleObj: ControlViewToggleObj) {
    this.store.dispatch(new fromViewEditActions.RemoveHiddenElementId(controlViewToggleObj));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromViewEditActions.Reset());
  }
}
