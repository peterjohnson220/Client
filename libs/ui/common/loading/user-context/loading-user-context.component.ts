import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import * as fromUserContextActions from 'libs/state/app-context/actions/user-context.actions';
import * as fromUserAssignedRoleActions from 'libs/state/app-context/actions/user-assigned-roles.actions';
import * as fromLegacyCompanySettingsActions from 'libs/state/app-context/actions/legacy-company-settings.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import * as fromRootState from 'libs/state/state';

import { UserContext } from '../../../../models';

declare var initializePendo: any;

@Component({
  selector: 'pf-loading-user-context',
  templateUrl: './loading-user-context.component.html'
})
export class LoadingUserContextComponent implements OnInit, OnDestroy {

  userContextSubscription: Subscription;

  gettingUserContext$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.gettingUserContext$ = store.pipe(select(fromRootState.getGettingUserContext));
    this.userContext$ = store.pipe(select(fromRootState.getUserContext));
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (uc && !uc.IsPublic && !uc.WorkflowStepInfo) {
        this.store.dispatch(new fromUserAssignedRoleActions.GetUserAssignedRoles());
        this.store.dispatch(new fromLegacyCompanySettingsActions.GetCompanySettings());
        this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());
        this.store.dispatch(new fromUiPersistenceSettingsActions.GetUiPersistenceSettings());
      }
    });
    this.store.dispatch(new fromUserContextActions.GetUserContext());

    // TODO: this initialize pendo code should be moved to the app-wrapper component when the app wrappers are consolidated
    this.userContext$.pipe(
      filter(uc => !!uc),
      take(1)
    ).subscribe(uc => {
      if (typeof initializePendo !== 'undefined') {
        initializePendo(uc);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userContextSubscription) {
      this.userContextSubscription.unsubscribe();
    }
  }
}
