import { Injectable } from '@angular/core';
import { Router} from '@angular/router';

import { isEmpty, isObject, cloneDeep } from 'lodash';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, filter, mergeMap, withLatestFrom, tap, map, switchMap } from 'rxjs/operators';

import { PayMarketApiService, LoaderFieldMappingsApiService } from 'libs/data/payfactors-api';
import { MappingsHrisApiService } from 'libs/data/payfactors-api/hris-api';
import { OrgDataEntityType } from 'libs/constants';
import { PayMarket } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { PayfactorsApiModelMapper, EntityMappingHelper } from '../helpers';
import * as fromFieldMappingActions from '../actions/field-mapping.actions';
import * as fromReducers from '../reducers';

@Injectable()
export class FieldMappingEffects {
  @Effect()
  initFieldMappingPageBeginLoading$ = this.actions$.pipe(
    ofType<fromFieldMappingActions.InitFieldMappingCard>(fromFieldMappingActions.INIT_FIELD_MAPPING_CARD),
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
    switchMap(obj => {
      const actions = [];

      obj.connectionSummary.selectedEntities.forEach(entity => {
        const entityType = OrgDataEntityType[entity];
        actions.push(this.mappingsHrisApiService.getProviderFields(obj.userContext, entityType).pipe(
          map((response) => {
            const pFields = PayfactorsApiModelMapper.mapProviderEntityFieldsResponseToEntityDataField(response, entityType);
            return new fromFieldMappingActions.LoadProviderFieldsByEntitySuccess({entity: entity, providerEntityFields: pFields});
          })
        ));
        actions.push(this.mappingsHrisApiService.getPayfactorsFields(obj.userContext, entityType).pipe(
          map((response) => {
            const pfFields = PayfactorsApiModelMapper.mapPayfactorsEntityFieldsResponseToEntityDataField(response, entityType);
            return new fromFieldMappingActions.LoadPayfactorsFieldsByEntitySuccess({entity: entity, payfactorsEntityFields: pfFields});
          })
        ));
        actions.push(this.loaderFieldMappingsApiService.getCustomFieldsByEntity(entityType, obj.userContext.CompanyId).pipe(
          map(response => {
            return new fromFieldMappingActions.LoadCustomFieldsByEntitySuccess({
              customFields: response,
              entityType: entityType
            });
          })
        ));
      });

      actions.push(this.mappingsHrisApiService.getMappedFields(obj.userContext).pipe(
        mergeMap(response => {
          return [new fromFieldMappingActions.LoadMappedFields({mappedFields: response, selectedEntities: obj.connectionSummary.selectedEntities })];
        })
      ));

      return forkJoin(actions).pipe(
        mergeMap((response) => {
          return [...response, new fromFieldMappingActions.InitFieldMappingCardSuccess()];
        }),
        catchError(error => of(new fromFieldMappingActions.InitFieldMappingCardError()))
      );
    }),
    catchError(error => of(new fromFieldMappingActions.InitFieldMappingCardError()))
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
      this.store.pipe(select(fromReducers.getHrisConnectionSummary)),
      this.store.pipe(select(fromReducers.isFieldMappingPageDirty)),
      (action, userContext, payfactorsFields, connectionSummary, isDirty) => {
        return {
          action,
          userContext,
          payfactorsFields,
          connectionSummary,
          isDirty
      };
    }),
    mergeMap(obj => {
      if (!obj.isDirty) {
        return [new fromFieldMappingActions.SaveMappingSuccess(obj.connectionSummary.hasConnection)];
      }
      const mappingPackage = PayfactorsApiModelMapper.createMappingPackage(obj.payfactorsFields);
      return this.mappingsHrisApiService.saveMappingFields(obj.userContext, mappingPackage)
        .pipe(
          map((response: any) => {
            return new fromFieldMappingActions.SaveMappingSuccess(obj.connectionSummary.hasConnection);
          })
        );
    }),
    catchError((error) => of(new fromFieldMappingActions.SaveMappingError()))
  );

  @Effect({dispatch: false})
  saveMappingSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.SaveMappingSuccess>(fromFieldMappingActions.SAVE_MAPPING_SUCCESS),
    tap((action: fromFieldMappingActions.SaveMappingSuccess) => {
      if (action.payload) {
        return this.router.navigate(['']);
      }
      return this.router.navigate(['/transfer-data/inbound/transfer-schedule']);
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

  @Effect()
  loadMappedFieldsSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<fromFieldMappingActions.LoadMappedFields>(fromFieldMappingActions.LOAD_MAPPED_FIELDS),
    withLatestFrom(
      this.store.pipe(select(fromReducers.getPayfactorsFields)),
      this.store.pipe(select(fromReducers.getProviderFields)),
      (action, pfFields, pFields) => {
        return {
          action,
          pfFields,
          pFields
        };
      }
    ),
    mergeMap((obj) => {
      if (obj.action.payload.mappedFields) {
        const { updatedProviderFields, updatedPayfactorsFields } =
          EntityMappingHelper.mapMappedFieldsTpProviderAndPayfactorsFields(
            cloneDeep(obj.pFields),
            cloneDeep(obj.pfFields),
            obj.action.payload.mappedFields,
            obj.action.payload.selectedEntities
          );
        return [new fromFieldMappingActions.LoadMappedFieldsSucces({payfactorsFields: updatedPayfactorsFields, providerFields: updatedProviderFields})];
      }
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private mappingsHrisApiService: MappingsHrisApiService,
    private paymarketsApiService: PayMarketApiService,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService,
    private router: Router
  ) {}
}
