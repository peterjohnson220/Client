import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { isEmpty, isObject } from 'lodash';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, mergeMap, withLatestFrom, tap, map } from 'rxjs/operators';

import { MappingsHrisApiService } from 'libs/data/payfactors-api/hris-api';
import { OrgDataEntityType } from 'libs/constants';
import { ProviderEntitiyFieldsResponse, PayMarket } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { PayfactorsApiModelMapper } from '../helpers';
import * as fromFieldMappingActions from '../actions/field-mapping.actions';
import * as fromReducers from '../reducers';
import { PayMarketApiService } from 'libs/data/payfactors-api';

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
  loadPayfactorsFieldByEntity$: Observable<Action> = this.actions$.pipe(
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

  @Effect()
  trySaveMappings$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.TrySaveMapping>(fromFieldMappingActions.TRY_SAVE_MAPPING),
    withLatestFrom(
      this.store.pipe(select(fromReducers.getPayfactorsFields)),
      (action, payfactorsFields) => {
        return {
          action,
          payfactorsFields,
      };
    }),
    mergeMap(obj => {
      const nextAction = !isEmpty(obj.payfactorsFields.Employees) &&
        obj.payfactorsFields.Employees.some(field => field.FieldName === 'PayMarket' && isEmpty(field.AssociatedEntity)) ?
          new fromFieldMappingActions.OpenDefaultPaymarketModal() :
          new fromFieldMappingActions.SaveMapping();

      return [ nextAction ];
    }),
    catchError((error) => of(new fromFieldMappingActions.SaveMappingError()))
  );

  @Effect()
  saveMappings$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.SaveMapping>(fromFieldMappingActions.SAVE_MAPPING),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      this.store.pipe(select(fromReducers.getPayfactorsFields)),
      (action, userContext, payfactorsFields) => {
        return {
          action,
          userContext,
          payfactorsFields
      };
    }),
    mergeMap(obj => {
      const mappingPackage = PayfactorsApiModelMapper.createMappingPackage(obj.payfactorsFields);
      return this.mappingsHrisApiService.saveMappingFields(obj.userContext, mappingPackage)
        .pipe(
          map((response: any) => {
            return new fromFieldMappingActions.SaveMappingSuccess();
          })
        );
    }),
    catchError((error) => of(new fromFieldMappingActions.SaveMappingError()))
  );

  @Effect({ dispatch: false })
  saveMappingSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.SaveMappingSuccess>(fromFieldMappingActions.SAVE_MAPPING_SUCCESS),
    tap(() => {
      this.router.navigate(['/', 'transfer-schedule']);
    })
  );

  @Effect()
  dismissDefaultPaymarketModal$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.DismissDefaultPaymarketModal>(fromFieldMappingActions.DISMISS_DEFAULT_PAYMARKET_MODAL),
    filter(action => action.payload.saveDefaultPaymarket),
    mergeMap(() => [ new fromFieldMappingActions.SaveMapping() ]),
    catchError((error) => of(new fromFieldMappingActions.SaveMappingError()))
  );

  @Effect()
  loadDefaultPaymarket$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.LoadDefaultPaymarket>(fromFieldMappingActions.LOAD_DEFAULT_PAYMARKET),
    mergeMap(obj => {
      return this.paymarketsApiService.getAll()
        .pipe(
          mergeMap((paymarkets: PayMarket[]) => {
            const defaultPaymarket = paymarkets.find(paymarket => paymarket.DefaultScope);
            const defaultPaymarketName = isObject(defaultPaymarket) ? defaultPaymarket.PayMarket : 'National';

            return [
              new fromFieldMappingActions.LoadDefaultPaymarketSuccess({ defaultPaymarket: defaultPaymarketName }),
            ];
          })
        );
    }),
    catchError((error) => of(new fromFieldMappingActions.LoadDefaultPaymarketError()))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private mappingsHrisApiService: MappingsHrisApiService,
    private paymarketsApiService: PayMarketApiService,
    private router: Router
  ) {}
}
