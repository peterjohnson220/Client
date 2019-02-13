import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { withLatestFrom, map } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { SystemUserGroupNames } from 'libs/constants';

import * as fromComphubMainReducer from '../reducers';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';

@Injectable()
export class ComphubPageEffects {

  @Effect()
  initComphubPage$ = this.actions$
  .ofType(fromComphubPageActions.INIT)
  .pipe(
    withLatestFrom(
      this.store.select(fromRootState.getUserContext),
      this.store.select(fromRootState.getCompanySettings),
      (action, userContext, companySettings) =>
        ({ action, userContext, companySettings })
    ),
    map((data) => {
      const isSmallBizUser = data.userContext.CompanySystemUserGroupsGroupName === SystemUserGroupNames.SmallBusiness;
      const hasNotYetAcceptedPeerTC = data.companySettings.some(s =>
        s.Key === CompanySettingsEnum.PeerTermsAndConditionsAccepted &&
        s.Value === 'false');
      if (isSmallBizUser || hasNotYetAcceptedPeerTC) {
        return new fromDataCardActions.ShowPeerBanner();
      }
      return { type: 'NO_ACTION' };
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>
  ) {}
}
