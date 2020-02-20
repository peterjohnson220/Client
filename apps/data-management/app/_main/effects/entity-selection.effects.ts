import {Injectable} from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';

import {Observable, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import {ProviderSupportedEntityDTO} from 'libs/models/hris-api/provider/response';
import {ProvidersHrisApiService} from 'libs/data/payfactors-api/hris-api/providers';
import {ConnectionsHrisApiService} from 'libs/data/payfactors-api/hris-api/connections';

import * as fromHrisConnectionActions from '../actions/hris-connection.actions';
import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import * as fromEntitySelectionActions from '../actions/entity-selection.actions';
import * as fromDataManagementMainReducer from '../reducers';
import {PayfactorsApiModelMapper} from '../helpers';
import {TransferDataWorkflowStep} from '../data';

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
              return new fromEntitySelectionActions.UpdateEntitySelectionsSuccess();
            }),
            catchError(e => of(new fromEntitySelectionActions.UpdateEntitySelectionsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private providersHrisApiService: ProvidersHrisApiService,
    private connectionsHrisApiService: ConnectionsHrisApiService
  ) {}
}
