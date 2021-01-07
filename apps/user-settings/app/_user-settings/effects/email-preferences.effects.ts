import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import orderBy from 'lodash/orderBy';

import { UserApiService } from 'libs/data/payfactors-api/user';
import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';

import { UserSubscriptionDto } from 'libs/models/payfactors-api/UserSubscriptionDto/user-subscription-dto.model';

import { PayfactorsApiModelMapper, UserSubscriptionDtoToUserSubscriptionMapper } from '../helpers';
import { UserSubscription } from '../models/communication-preferences';
import * as fromEmailPreferencesReducer from '../reducers';
import * as fromEmailPreferenceActions from '../actions/email-preferences.actions';

@Injectable()
export class EmailPreferencesEffects {

  @Effect()
  getUserSubscriptions$ = this.actions$
    .pipe(
      ofType(fromEmailPreferenceActions.GET_USER_SUBSCRIPTIONS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action: fromEmailPreferenceActions.GetUserSubscriptions, userContext: UserContext)  =>
          ({action, userContext})
      ),
      switchMap((data) => {
        return this.userApiService.getUserSubscriptions(data.userContext.UserId)
          .pipe(
            map((userSubscriptions: UserSubscriptionDto[]) =>
              new fromEmailPreferenceActions.GetUserSubscriptionsSuccess(this.mapToSubscriptions(userSubscriptions))),
            catchError(() => of(new fromEmailPreferenceActions.GetUserSubscriptionsError()))
          );
        }
      )
    );

  @Effect()
  updateUserSubscriptions$ = this.actions$
    .pipe(
      ofType(fromEmailPreferenceActions.UPDATE_USER_SUBSCRIPTIONS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action: fromEmailPreferenceActions.UpdateUserSubscriptions, userContext: UserContext) =>
          ({action, userContext})
      ),
      switchMap((data) => {
        const request = PayfactorsApiModelMapper.buildUserSubscriptionRequest(data.action.payload);
        return this.userApiService.updateUserSubscriptions(data.userContext.UserId, request)
          .pipe(
            map(() => new fromEmailPreferenceActions.UpdateUserSubscriptionsSuccess()),
            catchError(() => of(new fromEmailPreferenceActions.UpdateUserSubscriptionError()))
          );
      })
    );

  private mapToSubscriptions(userSubscriptionDtos: UserSubscriptionDto[]) : UserSubscription[] {
    return orderBy(userSubscriptionDtos.map(
      us => UserSubscriptionDtoToUserSubscriptionMapper.mapUserSubscriptionDtoToUserSubscription(us)));
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromEmailPreferencesReducer.State>,
    private userApiService: UserApiService
  ) {}
}
