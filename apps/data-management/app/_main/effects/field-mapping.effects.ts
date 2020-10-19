import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, endWith, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { OrgDataEntityType } from 'libs/constants';
import {
    ConverterSettingsHrisApiService, LoaderFieldMappingsApiService, LoaderSettingsApiService, MappingsHrisApiService, PayMarketApiService
} from 'libs/data/payfactors-api';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import { ConverterSettings, LoaderSetting, PayMarket } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { EntityMappingHelper, PayfactorsApiModelMapper } from '../helpers';
import * as fromFieldMappingActions from '../actions/field-mapping.actions';
import * as fromOrgDataFieldMappingsActions from '../actions/organizational-data-field-mapping.actions';
import * as fromConverterSettingsActions from '../actions/converter-settings.actions';
import * as fromReducers from '../reducers';
import { FullReplaceModes } from '../models';

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
            return new fromFieldMappingActions.LoadProviderFieldsByEntitySuccess({ entity: entity, providerEntityFields: pFields });
          })
        ));
        actions.push(this.mappingsHrisApiService.getPayfactorsFields(obj.userContext, entityType).pipe(
          map((response) => {
            const pfFields = PayfactorsApiModelMapper.mapPayfactorsEntityFieldsResponseToEntityDataField(response, entityType);
            return new fromFieldMappingActions.LoadPayfactorsFieldsByEntitySuccess({ entity: entity, payfactorsEntityFields: pfFields });
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
          return [new fromFieldMappingActions.LoadMappedFields({ mappedFields: response, selectedEntities: obj.connectionSummary.selectedEntities })];
        })
      ));

      actions.push(this.converterSettingsApiService.get(obj.userContext, obj.connectionSummary.connectionID).pipe(
        map((response: ConverterSettings[]) => {
          return new fromConverterSettingsActions.GetConverterSettingsSuccess(response);
        })
      ));

      if (obj.connectionSummary.loaderConfigurationGroupId) {
        actions.push(this.loaderSettingsApiService.getCompanyLoaderSettings(obj.userContext.CompanyId, obj.connectionSummary.loaderConfigurationGroupId).pipe(
          map((result: LoaderSetting[]) => {
            return new fromLoaderSettingsActions.LoadingLoaderSettingsSuccess(result);
          })
        ));
      }

      return forkJoin(actions).pipe(
        mergeMap((response) => {
          return [...response,
          new fromFieldMappingActions.InitFieldMappingCardSuccess()
          ];
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
      return [nextAction];
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
      this.store.pipe(select(fromReducers.getFullReplaceModes)),
      (action, userContext, payfactorsFields, connectionSummary, isDirty, fullReplaceModes) => {
        return {
          action,
          userContext,
          payfactorsFields,
          connectionSummary,
          isDirty,
          fullReplaceModes
        };
      }),
    mergeMap(obj => {
      if (!obj.isDirty) {
        const newConnectionSummary = cloneDeep(obj.connectionSummary);
        const newFullReplaceModes: FullReplaceModes = {
          employeesFullReplace: obj.fullReplaceModes.doFullReplaceEmployees,
          structureMappingsFullReplace: obj.fullReplaceModes.doFullReplaceStructureMappings,
          benefitsFullReplace: obj.fullReplaceModes.doFullReplaceBenefits
        };
        newConnectionSummary.fullReplaceModes = newFullReplaceModes;
        const loaderSettingsDto = PayfactorsApiModelMapper.getLoaderSettingsDtoForConnection(obj.userContext, newConnectionSummary);
        return [
          new fromConverterSettingsActions.SaveConverterSettings(),
          new fromLoaderSettingsActions.SavingLoaderSettings(loaderSettingsDto),
          new fromFieldMappingActions.SaveMappingSuccess(obj.connectionSummary.hasConnection)
        ];
      }
      const mappingPackage = PayfactorsApiModelMapper.createMappingPackage(obj.payfactorsFields);
      return this.mappingsHrisApiService.saveMappingFields(obj.userContext, mappingPackage)
        .pipe(
          mergeMap((response: any) => {
            const newConnectionSummary = cloneDeep(obj.connectionSummary);
            const newFullReplaceModes: FullReplaceModes = {
              employeesFullReplace: obj.fullReplaceModes.doFullReplaceEmployees,
              structureMappingsFullReplace: obj.fullReplaceModes.doFullReplaceStructureMappings,
              benefitsFullReplace: obj.fullReplaceModes.doFullReplaceBenefits
            };
            newConnectionSummary.fullReplaceModes = newFullReplaceModes;
            const loaderSettingsDto = PayfactorsApiModelMapper.getLoaderSettingsDtoForConnection(obj.userContext, newConnectionSummary);
            const loadersMappingPackage = PayfactorsApiModelMapper.getLoadersMappings(obj.userContext.CompanyId, obj.connectionSummary, obj.payfactorsFields);

            return [
              new fromConverterSettingsActions.SaveConverterSettings(),
              new fromLoaderSettingsActions.SavingLoaderSettings(loaderSettingsDto),
              new fromOrgDataFieldMappingsActions.SavingFieldMappings(loadersMappingPackage),
              new fromFieldMappingActions.SaveMappingSuccess(obj.connectionSummary.hasConnection),
            ];
          }),
          catchError((error) => of(new fromFieldMappingActions.SaveMappingError())
          ));
    })
  );

  @Effect({ dispatch: false })
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
    mergeMap(() => [new fromFieldMappingActions.SaveMapping()]),
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
        return [new fromFieldMappingActions.LoadMappedFieldsSucces({ payfactorsFields: updatedPayfactorsFields, providerFields: updatedProviderFields })];
      }
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private mappingsHrisApiService: MappingsHrisApiService,
    private paymarketsApiService: PayMarketApiService,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService,
    private converterSettingsApiService: ConverterSettingsHrisApiService,
    private loaderSettingsApiService: LoaderSettingsApiService,
    private router: Router
  ) { }
}
