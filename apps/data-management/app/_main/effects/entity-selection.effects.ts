import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { find } from 'lodash';

import { SyncScheduleHrisApiService } from 'libs/data/payfactors-api';
import { ConnectionsHrisApiService } from 'libs/data/payfactors-api/hris-api/connections';
import { MappingsHrisApiService } from 'libs/data/payfactors-api/hris-api/mappings';
import { ProvidersHrisApiService } from 'libs/data/payfactors-api/hris-api/providers';
import { ProviderSupportedEntityDTO } from 'libs/models/hris-api/provider/response';
import * as fromRootState from 'libs/state/state';

import * as fromHrisConnectionActions from '../actions/hris-connection.actions';
import * as fromEntitySelectionActions from '../actions/entity-selection.actions';
import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { TransferDataWorkflowStep } from '../data';

@Injectable()
export class EntitySelectionEffects {

  @Effect()
  initEntitySelection$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromEntitySelectionActions.INIT),
      mergeMap(() => {
        return [
          new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.EntitySelection),
          new fromHrisConnectionActions.GetHrisConnectionSummary()
        ];
      })
    );

  @Effect()
  loadSelectedEntities$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromEntitySelectionActions.LOAD_ENTITY_SELECTION),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action: fromEntitySelectionActions.LoadEntitySelection, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap(( obj) => {
        return this.providersHrisApiService.getEntitySelectionByProvider(obj.userContext, obj.action.payload.ProviderId)
          .pipe(
            map((response: ProviderSupportedEntityDTO[]) => {
              const entities = PayfactorsApiModelMapper.mapEntitySelectionResponseToEntitySelection(response);
              return new fromEntitySelectionActions.LoadEntitySelectionSuccess(entities);
            }),
            catchError(e => of(new fromEntitySelectionActions.LoadEntitySelectionError()))
          );
      })
    );

  @Effect()
  updateSelectedEntities$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromEntitySelectionActions.UPDATE_ENTITY_SELECTIONS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action: fromEntitySelectionActions.UpdateEntitySelections, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap(( obj) => {
        return this.connectionsHrisApiService.updateSelectedEntities(obj.userContext, obj.action.payload.connectionId, obj.action.payload.selectedEntities)
          .pipe(
            map(() => {
              return new fromEntitySelectionActions.UpdateEntitySelectionsSuccess(obj.action.payload.redirectRoute);
            }),
            catchError(e => of(new fromEntitySelectionActions.UpdateEntitySelectionsError()))
          );
      })
    );

  @Effect()
  deactivateMappingsForEntity$ = this.actions$
    .pipe(
      ofType<fromEntitySelectionActions.DeactivateMappingForEntities>(fromEntitySelectionActions.DEACTIVATE_MAPPINGS_FOR_ENTITIES),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        this.store.pipe(select(fromDataManagementMainReducer.getHrisConnectionSummary)),
        (action: fromEntitySelectionActions.DeactivateMappingForEntities, userContext, connectionSummary) => {
          return {
            action,
            userContext,
            connectionSummary
          };
        }
      ),
      switchMap((obj) => {
        return this.syncScheduleHrisApiService.getTransferScheduleSummary(obj.userContext).pipe(
          mergeMap((response) => {
            if (!response) {
              return [new fromEntitySelectionActions.DeactivateMappingForEntitiesError()];
            }

            const actions = [];
            obj.action.payload.entityMappingsToRemove.forEach(element => {
              actions.push(this.mappingsHrisApiService.deactivateEntityMapping(obj.userContext, element));
              find(response, (syncSchedule) => {
                if (syncSchedule &&
                    syncSchedule.entityMappingTypeCode === element &&
                    syncSchedule.active === 1 &&
                    syncSchedule.syncSchedule_ID !== null) {
                      actions.push(
                        this.syncScheduleHrisApiService.disableTransferSchedule(obj.userContext, syncSchedule.syncSchedule_ID));
                }
              });
            });
            return forkJoin(actions).pipe(
              switchMap(() => {
                const route = obj.action.payload.deactivateRedirectRoute;
                return [
                  new fromEntitySelectionActions.OpenRemoveEntityModal(false),
                  new fromEntitySelectionActions.DeactivateMappingForEntitiesSuccess(),
                  new fromEntitySelectionActions.UpdateEntitySelections(
                    { connectionId: obj.connectionSummary.connectionID,
                      selectedEntities: obj.action.payload.selectedEntities,
                      redirectRoute: obj.action.payload.deactivateRedirectRoute}),
                ];
              })
            );
          })
        );
      }),
      catchError(error => of(new fromEntitySelectionActions.DeactivateMappingForEntitiesError()))
    );

  @Effect({dispatch: false})
  updateEntitySelectionSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromEntitySelectionActions.UpdateEntitySelectionsSuccess>(fromEntitySelectionActions.UPDATE_ENTITY_SELECTIONS_SUCCESS),
      tap((action: fromEntitySelectionActions.UpdateEntitySelectionsSuccess) => {
        if (action.payload) {
          return this.router.navigate([action.payload]);
        }
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private providersHrisApiService: ProvidersHrisApiService,
    private connectionsHrisApiService: ConnectionsHrisApiService,
    private mappingsHrisApiService: MappingsHrisApiService,
    private syncScheduleHrisApiService: SyncScheduleHrisApiService,
    private router: Router
  ) {}
}
