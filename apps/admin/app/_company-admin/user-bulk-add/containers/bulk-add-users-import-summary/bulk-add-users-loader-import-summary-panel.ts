import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { toggleStateAnimation } from '../../animations/toggle-animations';
import { BaseBulkAddUsersTogglePanelComponent } from '../base-bulk-add-users-toggle-panel';
import { PanelState } from '../base-toggle-panel';
import * as fromBulkAddUsersReducer from '../../reducers';
import * as fromUserBulkAddActions from '../../actions/user-bulk-add.action';

@Component({
    selector: 'pf-bulk-add-users-loader-import-summary-panel',
    templateUrl: './bulk-add-users-loader-import-summary-panel.html',
    styleUrls: ['../bulk-add-users-loader-panel.css', './bulk-add-users-loader-import-summary-panel.css'],
    animations: [toggleStateAnimation],
})
export class BulkAddUsersLoaderImportSummaryPanelComponent extends BaseBulkAddUsersTogglePanelComponent implements OnInit, OnDestroy {
  importCount: number;

  getImportCountSuccess$: Observable<any>;
  getImportCountSuccessSubscription: Subscription;
  getImportCountError$: Observable<boolean>;
  getImportCountErrorSubscription: Subscription;

  constructor(store: Store<fromBulkAddUsersReducer.State>) {
      super(store);
    this.getImportCountSuccess$ = this.store.select(fromBulkAddUsersReducer.getImportCountSuccess);
    this.getImportCountError$ = this.store.select(fromBulkAddUsersReducer.getImportCountError);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getImportCountSuccessSubscription = this.getImportCountSuccess$.subscribe(response => {
      if (response) {
        this.importCount = response.MappedBulkAddUsersCount;
        this.panelState = PanelState.Complete;
        this.onComplete();
      }
    });

    this.getImportCountErrorSubscription = this.getImportCountError$.subscribe(response => {
      if (response) {
        this.panelState = PanelState.Error;
      }
    });
  }


  ngOnDestroy(): void {
      super.ngOnDestroy();
      if (this.getImportCountSuccessSubscription) {
        this.getImportCountSuccessSubscription.unsubscribe();
      }

      if (this.getImportCountErrorSubscription) {
        this.getImportCountErrorSubscription.unsubscribe();
      }
  }

  init() {
    this.resetPanelState();
    this.getImportCount();
  }

  private getImportCount() {
    this.store.dispatch(new fromUserBulkAddActions.GetImportCount());
  }

}
