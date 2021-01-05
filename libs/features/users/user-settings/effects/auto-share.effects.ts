import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, withLatestFrom, } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserApiService } from 'libs/data/payfactors-api';
import { PayfactorsApiModelMapper } from 'libs/features/users/user-settings/helpers/payfactors-api-model-mapper.helpter';

import * as fromAutoShareActions from '../actions/auto-share.actions';
import * as fromUserSettingsSharedReducer from '../reducers';
import * as fromRootState from '../../../../state/state';

@Injectable()
export class AutoShareEffects {

  @Effect()
  getShareableUsers$ = this.action$
    .pipe(
      ofType(fromAutoShareActions.GET_SHAREABLE_USERS),
      withLatestFrom(
        this.store.select(fromRootState.getUserContext),
        (action: fromAutoShareActions.GetShareableUsers, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((data) => {
        return this.userApiService.getShareableUsers(data.userContext.UserId, data.userContext.CompanyId)
          .pipe(
            map((response) => new fromAutoShareActions.GetShareableUsersSuccess(PayfactorsApiModelMapper.mapShareUserResponseToAutoShareUser(response))),
            catchError(() => of(new fromAutoShareActions.GetShareableUsersError()))
          );
      })
    );

  @Effect()
  getShareableUsersSuccess$ = this.action$
    .pipe(
      ofType(fromAutoShareActions.GET_SHAREABLE_USERS_SUCCESS),
      withLatestFrom(
        this.store.select(fromRootState.getUserContext),
        (action: fromAutoShareActions.GetShareableUsers, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((data) => {
        return this.userApiService.getAutoSharedUsers(data.userContext.UserId)
          .pipe(
            mergeMap((response) => [
              new fromAutoShareActions.GetAutoSharedUsersSuccess(response)
            ]),
            catchError(error => of (new fromAutoShareActions.GetAutoSharedUsersError()))
          );
      })
    );

  @Effect()
  removeAutoSharedUser$ = this.action$
    .pipe(
      ofType(fromAutoShareActions.REMOVE_AUTO_SHARED_USER),
      switchMap((action: fromAutoShareActions.RemoveAutoSharedUser) => {
        return this.userApiService.removeAutoSharedUser(action.payload)
          .pipe(
            map(() => new fromAutoShareActions.RemoveAutoSharedUserSuccess(action.payload)),
            catchError(() => of(new fromAutoShareActions.RemoveAutoSharedUserError()))
          );
      })
    );

  @Effect()
  saveAutoShareUsers$ = this.action$
    .pipe(
      ofType(fromAutoShareActions.SAVE_AUTO_SHARE_USERS),
      switchMap((action: fromAutoShareActions.SaveAutoShareUsers) => {
        return this.userApiService.saveAutoShareUsers(action.payload)
          .pipe(
            map(() => new fromAutoShareActions.SaveAutoShareUsersSuccess()),
            catchError(() => of(new fromAutoShareActions.SaveAutoShareUsersError()))
          );
      })
    );

  constructor(
    private action$: Actions,
    private store: Store<fromUserSettingsSharedReducer.State>,
    private userApiService: UserApiService,
  ) {}
}
