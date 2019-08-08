import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDataViewActions from '../../../actions/data-view.actions';
import { SaveUserWorkbookModalData, SaveWorkbookMode, UserDataView } from '../../../models';
import { SaveUserWorkbookModalComponent } from '../../../components/save-user-workbook-modal';

@Component({
  selector: 'pf-custom-report-view-page',
  templateUrl: './custom-report-view.page.html',
  styleUrls: ['./custom-report-view.page.scss']
})

export class CustomReportViewPageComponent implements OnInit, OnDestroy {
  @ViewChild('editWorkbookModal', { static: false }) public editUserWorkbookModalComponent: SaveUserWorkbookModalComponent;

  userDataView$: Observable<AsyncStateObj<UserDataView>>;
  editingUserDataView$: Observable<boolean>;
  editUserDataViewConflict$: Observable<boolean>;
  editUserDataViewError$: Observable<boolean>;

  editReportSuccessSubscription: Subscription;
  userDataViewSubscription: Subscription;

  workbookModes = SaveWorkbookMode;
  editWorkbookData: SaveUserWorkbookModalData;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private route: ActivatedRoute
  ) {
    this.userDataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync));
    this.editingUserDataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getEditingUserReport));
    this.editUserDataViewError$ = this.store.pipe(select(fromDataInsightsMainReducer.getEditUserReportError));
    this.editUserDataViewConflict$ = this.store.pipe(select(fromDataInsightsMainReducer.getEditUserReportConflict));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromDataViewActions.GetUserDataView({ dataViewId: this.route.snapshot.params.dataViewId }));
    this.store.dispatch(new fromDataViewActions.GetReportFields({ dataViewId: this.route.snapshot.params.dataViewId}));
    this.editReportSuccessSubscription =
      this.store.pipe(select(fromDataInsightsMainReducer.getEditUserReportSuccess)).subscribe(succeeded => {
      if (succeeded && this.editUserWorkbookModalComponent) {
        this.editUserWorkbookModalComponent.close();
      }
    });
    this.userDataViewSubscription = this.userDataView$.subscribe( u => {
      if (u.obj) {
        this.editWorkbookData = {
          Name: u.obj.Name,
          Summary: u.obj.Summary
        };
      }
    });
  }

  handleEditClicked(): void {
    this.editUserWorkbookModalComponent.open();
  }

  handleDuplicateClicked(): void {
    this.editUserWorkbookModalComponent.open();
  }

  handleEditSaveClicked(workbookData: SaveUserWorkbookModalData): void {
    this.store.dispatch(new fromDataViewActions.EditUserReport(workbookData));
  }

  ngOnDestroy(): void {
    this.editReportSuccessSubscription.unsubscribe();
    this.userDataViewSubscription.unsubscribe();
  }
}
