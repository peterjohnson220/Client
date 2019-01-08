import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
export class LoadingUserContextComponent implements OnInit {
  gettingUserContext$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.gettingUserContext$ = store.pipe(select(fromRootState.getGettingUserContext));
    this.userContext$ = store.pipe(select(fromRootState.getUserContext));
  }

  ngOnInit() {
    this.store.dispatch(new fromUserContextActions.GetUserContext());
    this.store.dispatch(new fromUserAssignedRoleActions.GetUserAssignedRoles());
    this.store.dispatch(new fromLegacyCompanySettingsActions.GetCompanySettings());
    this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());
    this.store.dispatch(new fromUiPersistenceSettingsActions.GetUiPersistenceSettings());

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
}
