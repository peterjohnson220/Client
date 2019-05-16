import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { UserFilterResponse } from 'libs/models/payfactors-api/user-profile/response';
import { JdmListFilter } from 'libs/models/user-profile';
import { UserProfileApiService } from 'libs/data/payfactors-api/user';

import * as fromUserFilterActions from '../actions/user-filter.actions';
import * as fromUserFilterReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../../shared/helpers';

@Injectable()
export class UserFilterEffects {
  @Effect()
  addUserFilter$: Observable<Action> = this.actions$
    .ofType(fromUserFilterActions.ADD_USER_FILTER).pipe(
      switchMap((action: fromUserFilterActions.AddUserFilter) =>
        this.userProfileApiService.addUserFilter(action.payload).pipe(
          map((response: UserFilterResponse) => {
            return new fromUserFilterActions.AddUserFilterSuccess(PayfactorsApiModelMapper.mapUserFilterResponseToJdmListFilter(response));
          }),
          catchError(response => of(new fromUserFilterActions.AddUserFilterError()))
        )
      ));

  @Effect()
  deleteUserFilter$: Observable<Action> = this.actions$
    .ofType(fromUserFilterActions.DELETE_USER_FILTER).pipe(
      switchMap((action: fromUserFilterActions.DeleteUserFilter) =>
        this.userProfileApiService.deleteUserFilter(action.payload).pipe(
          map((response: string) => {
            return new fromUserFilterActions.DeleteUserFilterSuccess(response);
          }),
          catchError(response => of(new fromUserFilterActions.DeleteUserFilterError()))
        )
      ));

  @Effect()
  getUserFilterList$: Observable<Action> = this.actions$
    .ofType(fromUserFilterActions.LOAD_USER_FILTER_LIST).pipe(
      switchMap((action: fromUserFilterActions.LoadUserFilterList) =>
        this.userProfileApiService.getUserFilterList().pipe(
          map((response: JdmListFilter[]) => {
            return new fromUserFilterActions.LoadUserFilterListSuccess(response);
          }),
          catchError(response => of(new fromUserFilterActions.LoadUserFilterListError(response)))
        )
      ));

  constructor(
    private actions$: Actions,
    private userProfileApiService: UserProfileApiService,
    private store: Store<fromUserFilterReducer.State>,
  ) {}
}
