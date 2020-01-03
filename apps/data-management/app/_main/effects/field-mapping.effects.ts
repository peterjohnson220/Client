import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { MappingsHrisApiService } from 'libs/data/payfactors-api/hris-api';
import { OrgDataEntityType } from 'libs/constants';
import { ProviderEntitiyFieldsResponse } from 'libs/models';

import * as fromFieldMappingActions from '../actions/field-mapping.actions';
import * as fromReducers from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class FieldMappingEffects {

  @Effect()
  initFieldMappings$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.InitFieldMappingCard>(fromFieldMappingActions.INIT_FIELD_MAPPING_CARD),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => {
        return {
          action,
          userContext
      };
    }),
    mergeMap(obj => {
      const actions = [];
      obj.action.payload.entities.forEach(entity => {
        const entityType = OrgDataEntityType[entity.EntityType];
        actions.push(new fromFieldMappingActions.LoadProviderFieldsByEntity({ entity: entityType}));
        actions.push(new fromFieldMappingActions.LoadPayfactorsFieldsByEntity({ entity: entityType}));
      });

      return actions;
    }),
    catchError(error => of(new fromFieldMappingActions.InitFieldMappingCardError()))
  );

  @Effect()
  loadProviderFieldByEntity$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.LoadProviderFieldsByEntity>(fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => {
        return {
          action,
          userContext
      };
    }),
    mergeMap(obj => {
      return this.mappingsHrisApiService.getProviderFields(obj.userContext, obj.action.payload.entity)
        .pipe(
          mergeMap((response: ProviderEntitiyFieldsResponse) => {
            const fields = PayfactorsApiModelMapper.mapProviderEntityFieldsResponseToEntityDataField(response, OrgDataEntityType[obj.action.payload.entity]);
            return [
              new fromFieldMappingActions.LoadProviderFieldsByEntitySuccess({entity: obj.action.payload.entity, providerEntityFields: fields})
            ];
          })
        );
    }),
    catchError((error) => of(new fromFieldMappingActions.LoadProviderFieldsByEntityError()))
  );

  @Effect()
  loadPayfactorsrFieldByEntity$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.LoadPayfactorsFieldsByEntity>(fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => {
        return {
          action,
          userContext
      };
    }),
    mergeMap(obj => {
      return this.mappingsHrisApiService.getPayfactorsFields(obj.userContext, obj.action.payload.entity)
        .pipe(
          mergeMap((response: any) => {
            const fields = PayfactorsApiModelMapper.mapPayfactorsEntityFieldsResponseToEntityDataField(response, OrgDataEntityType[obj.action.payload.entity]);
            return [
              new fromFieldMappingActions.LoadPayfactorsFieldsByEntitySuccess({ entity: obj.action.payload.entity, payfactorsEntityFields: fields})
            ];
          })
        );
    }),
    catchError((error) => of(new fromFieldMappingActions.LoadPayfactorsFieldsByEntityError()))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private mappingsHrisApiService: MappingsHrisApiService
  ) {}
}
