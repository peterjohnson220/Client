import { Injectable } from '@angular/core';


import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { isEmpty, isObject } from 'lodash';

import { ConnectionsHrisApiService } from 'libs/data/payfactors-api/hris-api/connections';
import { CredentialsPackage } from 'libs/models/hris-api/connection/request';
import { ConnectionSummaryResponse, ValidateCredentialsResponse } from 'libs/models/hris-api/connection/response';
import * as fromRootState from 'libs/state/state';

import { PayfactorsApiModelMapper } from '../helpers';
import * as fromHrisConnectionReducer from '../reducers/hris-connection.reducer';
import * as fromHrisConnectionActions from '../actions/hris-connection.actions';
import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import * as fromReducers from '../reducers';
import { TransferDataWorkflowStep } from '../data';

@Injectable()
export class HrisConnectionEffects {
  @Effect()
  authenticate$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromHrisConnectionActions.Validate>(fromHrisConnectionActions.VALIDATE),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => {
        return {
          action,
          userContext
        };
      }),
      switchMap((obj) => {
        let delayTime = 0;
        if (obj.action.payload.providerCode === 'PFTEST') {
          delayTime = 5000;
        }
        return this.connectionService.validateConnection(obj.userContext, obj.action.payload)
          .pipe(
            delay(delayTime),
            mergeMap((response: ValidateCredentialsResponse) => {
              if (!response.successful) {
                return [new fromHrisConnectionActions.ValidateError(response.errors)];
              }
              return [
                new fromHrisConnectionActions.ValidateSuccess(),
                new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.Validated)
              ];
            }),
            catchError(error => of(new fromHrisConnectionActions.ValidateError()))
          );
      })
    );

  @Effect()
    createConnection$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromHrisConnectionActions.CreateConnection>(fromHrisConnectionActions.CREATE_CONNECTION),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        this.store.pipe(select(fromReducers.getHrisConnectionSummary)),
      (action, userContext, connectionSummary) => {
        return {
          action,
          userContext,
          connectionSummary
        };
      }),
      switchMap((obj) => {
        const connectionPostModel =
          PayfactorsApiModelMapper.createConnectionPostRequest(obj.action.payload, obj.userContext.CompanyId, obj.connectionSummary.provider.ProviderId);
        if (obj.connectionSummary.connectionID) {
          connectionPostModel.connection.connection_ID = obj.connectionSummary.connectionID;
        }
        return this.connectionService.connect(obj.userContext, connectionPostModel)
          .pipe(
            switchMap((response: any) => {
              return this.connectionService.get(obj.userContext)
                .pipe(
                  map((newConnection: CredentialsPackage) => {
                    return new fromHrisConnectionActions.CreateConnectionSuccess(newConnection);
                  }),
                  catchError(error => of(new fromHrisConnectionActions.CreateConnectionError()))
                );
            }),
            catchError(error => of(new fromHrisConnectionActions.CreateConnectionError()))
          );
      })
    );

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

  @Effect()
  loadConnectionSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromHrisConnectionActions.GET_HRIS_CONNECTION_SUMMARY),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        this.store.pipe(select(fromReducers.getSelectedProvider)),
        this.store.pipe(select(fromReducers.getSelectedEntities)),
        (action, userContext, selectedProvider, selectedEntities) => {
          return {
            action,
            userContext,
            selectedProvider,
            selectedEntities,
          };
        }
      ),
      switchMap((obj) => {
        return this.connectionService.getSummary(obj.userContext)
          .pipe(
            map((response: ConnectionSummaryResponse) => {
              const summary = PayfactorsApiModelMapper.mapConnectionSummaryResponseToConnectionSummaryDto(response);

              if (isObject(obj.selectedProvider) && !isObject(summary.provider)) {
                summary.provider = obj.selectedProvider;
              }

              if (!isEmpty(obj.selectedEntities) && isEmpty(summary.selectedEntities)) {
                summary.selectedEntities = obj.selectedEntities.map(e => e.EntityType);
              }

              return new fromHrisConnectionActions.GetHrisConnectionSummarySuccess(summary);
            }),
            catchError(e => of(new fromHrisConnectionActions.GetHrisConnectionSummaryError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromHrisConnectionReducer.State>,
    private connectionService: ConnectionsHrisApiService
  ) {}
}
