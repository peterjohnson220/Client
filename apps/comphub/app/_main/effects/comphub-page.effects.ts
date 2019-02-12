import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { SystemUserGroupNames } from 'libs/constants';

import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../reducers';

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

  @Effect()
  onNavigation$ = this.actions$
    .ofType(
      fromComphubPageActions.NAVIGATE_TO_CARD,
      fromComphubPageActions.NAVIGATE_TO_NEXT_CARD,
      fromComphubPageActions.NAVIGATE_TO_PREVIOUS_CARD)
    .pipe(
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getPaymarketsFilter),
        (action, payMarketsFilter) => ({ payMarketsFilter })
      ),
      mergeMap((filter) => {
        const actions = [];
        if (filter) {
          actions.push(new fromMarketsCardActions.SetPaymarketFilter(''));
        }

        actions.push(new fromMarketsCardActions.OrderPayMarketsWithSelectedFirst());

        return actions;
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
  ) {}
}
