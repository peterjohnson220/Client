import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanyApiService, UserApiService } from 'libs/data/payfactors-api';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { CompanyDto } from 'libs/models';

import * as fromUsersListActions from '../actions/users-list.actions';

@Injectable()
export class UsersListEffects {

  @Effect()
  loadUsers$: Observable<Action> = this.actions$.pipe(
    ofType(fromUsersListActions.LOAD_USERS),
    switchMap((action: fromUsersListActions.LoadUsers) => {
      return this.userApiService.getByCompany(action.payload).pipe(
        map((users: UserResponse[]) => new fromUsersListActions.LoadUsersSuccess(users)),
        catchError(error => of(new fromUsersListActions.LoadUsersError()))
      );
    }
    )
  );

  @Effect()
  loadCompany$: Observable<Action> = this.actions$.pipe(
    ofType(fromUsersListActions.LOAD_COMPANY),
    switchMap((action: fromUsersListActions.LoadCompany) => {
      return this.companyApiService.get(action.payload).pipe(
        map((company: CompanyDto) => new fromUsersListActions.LoadCompanySuccess(company)),
        catchError(error => of(new fromUsersListActions.LoadCompanyError()))
      );
    }
    )
  );


  constructor(
    private actions$: Actions,
    private userApiService: UserApiService,
    private companyApiService: CompanyApiService
  ) { }
}
