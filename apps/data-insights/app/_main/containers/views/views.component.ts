import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromViewsActions from '../../actions/views.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Workbook } from '../../models';

@Component({
  selector: 'pf-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit, OnDestroy {
  companyWorkbooksAsync$: Observable<AsyncStateObj<Workbook[]>>;

  companyWorkbooksAsyncSub: Subscription;

  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.companyWorkbooksAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsyncFromViews));
  }

  ngOnInit(): void {
    this.companyWorkbooksAsyncSub = this.companyWorkbooksAsync$.subscribe(asyncObj => this.companyWorkbooksAsync = asyncObj);
  }

  ngOnDestroy(): void {
    this.companyWorkbooksAsyncSub.unsubscribe();
  }

  get anyFavorites() {
    return !!this.companyWorkbooksAsync &&
    !!this.companyWorkbooksAsync.obj &&
    this.companyWorkbooksAsync.obj.some(w => w.Views.obj.some(v => v.IsFavorite === true));
  }

  trackByFn(index: any, workbook: Workbook) {
    return workbook.WorkbookId;
  }

  handleFavoriteClicked(obj: any) {
    if (!obj || !obj.workbookId || !obj.view) {
      return;
    }
    if (obj.view.IsFavorite) {
      this.store.dispatch(new fromViewsActions.RemoveViewFavorite({ workbookId: obj.workbookId, viewId: obj.view.ViewId }));
    } else {
      this.store.dispatch(new fromViewsActions.AddViewFavorite({ workbookId: obj.workbookId, viewId: obj.view.ViewId }));
    }
  }

}
