import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fromHrisConnectionReducer from '../reducers/hris-connection.reducer';
import * as fromHrisConnectionActions from '../actions/hris-connection.actions';
import * as fromRootState from 'libs/state/state';

import {ConnectionsHrisApiService} from '../../../../../libs/data/payfactors-api/hris-api/connections';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import {CredentialsPackage} from '../../../../../libs/models/hris-api/connection/request';

@Injectable()
export class HrisConnectionEffects {

  @Effect()
  loadActiveConnection$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromHrisConnectionActions.GET_CURRENT_HRIS_CONNECTION),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.connectionService.get(obj.userContext)
          .pipe(
            map((response: CredentialsPackage) => {
              return new fromHrisConnectionActions.GetCurrentHrisConnectionSuccess(response);
            }),
            catchError(e => of(new fromHrisConnectionActions.GetCurrentHrisConnectionError()))
          );
      })
    );

  @Effect()
  deleteConnection$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromHrisConnectionActions.DELETE_HRIS_CONNECTION),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.connectionService.delete(obj.userContext)
          .pipe(
            map(() => {
              return new fromHrisConnectionActions.DeleteHRISConnectionSuccess();
            }),
            catchError(e => of(new fromHrisConnectionActions.DeleteHRISConnectionError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromHrisConnectionReducer.State>,
    private connectionService: ConnectionsHrisApiService
  ) {}
}
