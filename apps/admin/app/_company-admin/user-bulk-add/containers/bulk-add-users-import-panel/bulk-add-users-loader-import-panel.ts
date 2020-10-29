import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserBulkAdd } from 'libs/models/admin/user-bulk-add.model';

import { toggleStateAnimation } from '../../animations/toggle-animations';
import { BaseBulkAddUsersTogglePanelComponent } from '../base-bulk-add-users-toggle-panel';
import { PanelState } from '../base-toggle-panel.directive';
import * as fromBulkAddUsersReducer from '../../reducers';
import * as fromUserBulkAddActions from '../../actions/user-bulk-add.action';


@Component({
    selector: 'pf-bulk-add-users-loader-import-panel',
    templateUrl: './bulk-add-users-loader-import-panel.html',
    styleUrls: ['../bulk-add-users-loader-panel.css'],
    animations: [toggleStateAnimation],
})
export class BulkAddUsersLoaderImportPanelComponent extends BaseBulkAddUsersTogglePanelComponent implements OnInit, OnDestroy {

  saveBulkAddUsersSuccess$: Observable<any>;
  saveBulkAddUsersSuccessSubscription: Subscription;
  saveBulkAddUsersError$: Observable<boolean>;
  saveBulkAddUsersErrorSubscription: Subscription;
  userBulkAdd: UserBulkAdd;

  @Input() companyId: number;
  @Input() userWorksheet: string;

  constructor(
      store: Store<fromBulkAddUsersReducer.State>,
      private location: Location
  ) {
    super(store);
    this.saveBulkAddUsersSuccess$ = this.store.select(fromBulkAddUsersReducer.getSaveUsersSuccess);
    this.saveBulkAddUsersError$ = this.store.select(fromBulkAddUsersReducer.getSaveUsersError);
  }

  ngOnInit() {
    super.ngOnInit();
    this.saveBulkAddUsersSuccessSubscription = this.saveBulkAddUsersSuccess$.subscribe(response => {
      if (response) {
        this.panelState = PanelState.Complete;
        this.loaderStepComplete = true;
      }
    });

    this.saveBulkAddUsersErrorSubscription = this.saveBulkAddUsersError$.subscribe(response => {
      if (response) {
        this.panelState = PanelState.Error;
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.saveBulkAddUsersSuccessSubscription) {
      this.saveBulkAddUsersSuccessSubscription.unsubscribe();
    }

    if (this.saveBulkAddUsersErrorSubscription) {
      this.saveBulkAddUsersErrorSubscription.unsubscribe();
    }
  }

  init() {
    this.resetPanelState();
    this.saveBulkAddUsers();
  }

  private saveBulkAddUsers() {
    this.panelState = PanelState.Default;
    this.userBulkAdd = new UserBulkAdd(this.companyId, this.userWorksheet);
    this.store.dispatch(new fromUserBulkAddActions.SaveBulkAddUsers(this.userBulkAdd));
  }

  exit() {
    this.location.back();
  }
}
