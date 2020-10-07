import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { LoadTypes, CompositeDataLoadTypes } from 'libs/constants';
import { ConnectionsHrisApiService, ConfigurationGroupApiService, LoaderSettingsApiService } from 'libs/data/payfactors-api';
import { ConnectionSummaryResponse, CredentialsPackage, ValidateCredentialsResponse, PatchProperty } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { PayfactorsApiModelMapper } from '../helpers';
import * as fromHrisConnectionReducer from '../reducers/hris-connection.reducer';
import * as fromHrisConnectionActions from '../actions/hris-connection.actions';
import * as fromLoadersSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import * as fromReducers from '../reducers';
import { TransferDataWorkflowStep } from '../data';

@Injectable()
export class HrisConnectionEffects {
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
      switchMap(obj => this.loaderConfigurationGroupsApi.saveConfigurationGroup({
          CompanyId: obj.userContext.CompanyId,
          GroupName: 'HRIS Loader Config',
          LoaderConfigurationGroupId: null,
          LoadType: LoadTypes.Hris,
          PrimaryCompositeDataLoadType: CompositeDataLoadTypes.OrgData
        }).pipe(
          map(configGroup => ({...obj, configGroup})),
        ),
      ),
      switchMap(obj => {
        const connectionPostModel = PayfactorsApiModelMapper.createConnectionPostRequest(
          obj.action.payload,
          obj.userContext.CompanyId,
          obj.connectionSummary.provider.ProviderId,
          obj.connectionSummary.validationMode,
          obj.configGroup.LoaderConfigurationGroupId
        );
        if (obj.connectionSummary.connectionID) {
          connectionPostModel.connection.connection_ID = obj.connectionSummary.connectionID;
          connectionPostModel.connection.validationMode = obj.connectionSummary.validationMode;
        } else {
          connectionPostModel.connection.validationMode = true;
        }
        return this.connectionService.connect(obj.userContext, connectionPostModel)
          .pipe(
            switchMap((connectionId: number) => {
              return this.connectionService.getByConnectionId(obj.userContext, connectionId)
                .pipe(
                  map((connection: CredentialsPackage) => {
                    return new fromHrisConnectionActions.CreateConnectionSuccess({ credentials: connection, connectionId: connectionId });
                  }),
                  catchError(error => of(new fromHrisConnectionActions.CreateConnectionError()))
                );
            }),
            catchError(error => of(new fromHrisConnectionActions.CreateConnectionError()))
          );
      })
    );

  @Effect()
  createConnectionSuccess = this.actions$
    .pipe(
      ofType<fromHrisConnectionActions.CreateConnectionSuccess>(fromHrisConnectionActions.CREATE_CONNECTION_SUCCESS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        this.store.pipe(select(fromReducers.getActiveConnectionId)),
      (action, userContext, activeConnectionId) => {
        return {
          action,
          userContext,
          activeConnectionId
        };
      }),
      switchMap((obj) => {
        return this.connectionService.validateConnection(obj.userContext, obj.activeConnectionId)
        .pipe(
          mergeMap((response: ValidateCredentialsResponse) => {
            if (!response.successful) {
              return [new fromHrisConnectionActions.ValidateError(response.errors)];
            }
            return [
              new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.Validated),
              new fromHrisConnectionActions.GetHrisConnectionSummary(),
              new fromHrisConnectionActions.ValidateSuccess({success: response.successful, skipValidation: response.skipValidation})
            ];
          }),
          catchError(error => of(new fromHrisConnectionActions.ValidateError()))
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
      switchMap(obj => this.connectionService.getSummary(obj.userContext)
        .pipe(
          map(connectionSummary => ({
            ...obj,
            connectionSummary: PayfactorsApiModelMapper.mapConnectionSummaryResponseToConnectionSummaryDto(connectionSummary)
          })),
        )
      ),
      tap(({ userContext, connectionSummary }) => {
        if (isNumber(connectionSummary.loaderConfigurationGroupId)) {
          const loaderSettingsDto = PayfactorsApiModelMapper.getDisabledLoaderSettingsDtoForConnection(userContext, connectionSummary);
          this.loaderSettingsApiService.saveOrUpdate(loaderSettingsDto).subscribe();
        }
      }),
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

  // TODO: Fix this to be less reliant on re-auth or refactor to indicate
  @Effect()
    patchHrisConnection$: Observable<Action> = this.actions$
      .pipe(
        ofType<fromHrisConnectionActions.PatchConnection>(fromHrisConnectionActions.PATCH_CONNECTION),
        withLatestFrom(
          this.store.pipe(select(fromRootState.getUserContext)),
          this.store.pipe(select(fromReducers.getActiveConnectionId)),
        (action, userContext, activeConnectionId) => {
          return {
            action,
            userContext,
            activeConnectionId
          };
        }),
        switchMap((obj) => {
          const patchRequest = PayfactorsApiModelMapper.getPatchPropertyListFromObject(obj.action.payload);
          return this.connectionService.patchConnection(obj.userContext, obj.activeConnectionId, patchRequest)
            .pipe(
              map((response: number) => {
                return new fromHrisConnectionActions.PatchConnectionSuccess(response);
              }),
              catchError(e => of(new fromHrisConnectionActions.PatchConnectionError()))
          );
      })
    );

    @Effect()
    patchHrisConnectionSuccess$: Observable<Action> = this.actions$
      .pipe(
        ofType<fromHrisConnectionActions.PatchConnectionSuccess>(fromHrisConnectionActions.PATCH_CONNECTION_SUCCESS),
        withLatestFrom(
          this.store.pipe(select(fromRootState.getUserContext)),
          this.store.pipe(select(fromReducers.getActiveConnectionId)),
        (action, userContext, activeConnectionId) => {
          return {
            action,
            userContext,
            activeConnectionId
          };
        }),
        switchMap((obj) => {
          return this.connectionService.validateConnection(obj.userContext, obj.activeConnectionId)
            .pipe(
              mergeMap((response: ValidateCredentialsResponse) => {
                if (!response.successful) {
                  return [new fromHrisConnectionActions.ValidateError(response.errors)];
                }
                return [
                  new fromHrisConnectionActions.ValidateSuccess({
                    skipValidation: response.skipValidation,
                    success: response.successful,
                  }),
                  new fromHrisConnectionActions.GetHrisConnectionSummary(),
                  new fromHrisConnectionActions.OpenReAuthenticationModal(false)
                ];
              }),
              catchError(e => of(new fromHrisConnectionActions.PatchConnectionError()))
          );
      })
    );

    @Effect()
    toggleValidationMode$: Observable<Action> = this.actions$
      .pipe(
        ofType<fromHrisConnectionActions.ToggleValidationMode>(fromHrisConnectionActions.TOGGLE_VALIDATION_MODE),
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
          const request: PatchProperty = {
            PropertyName: 'ValidationMode',
            PropertyValue: obj.action.payload
          };
          const loaderSettingsDto = PayfactorsApiModelMapper.getLoaderSettingsDtoForConnection(obj.userContext, obj.connectionSummary);
          loaderSettingsDto.settings.find( setting => setting.KeyName === 'ValidateOnly').KeyValue = obj.action.payload.toString();
          return this.connectionService.patchConnection(obj.userContext, obj.connectionSummary.connectionID, [request], false)
            .pipe(
              mergeMap(() => {
                return [
                  new fromHrisConnectionActions.GetHrisConnectionSummary(),
                  new fromLoadersSettingsActions.SavingLoaderSettings(loaderSettingsDto),
                  new fromHrisConnectionActions.ToggleValidationModeSuccess()
                ];
              }),
            catchError(e => of(new fromHrisConnectionActions.ToggleValidationModeError()))
          );
        })
      );

  constructor(
    private actions$: Actions,
    private store: Store<fromHrisConnectionReducer.State>,
    private connectionService: ConnectionsHrisApiService,
    private loaderConfigurationGroupsApi: ConfigurationGroupApiService,
    private loaderSettingsApiService: LoaderSettingsApiService,
    private router: Router,
  ) {}
}
