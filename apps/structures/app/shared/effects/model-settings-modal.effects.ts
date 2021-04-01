import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { catchError, debounce, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import { CurrencyApiService } from 'libs/data/payfactors-api/currency';
import { CompositeFieldApiService } from 'libs/data/payfactors-api/composite-field';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { SurveyApiService } from 'libs/data/payfactors-api';
import { AsyncStateObj } from 'libs/models/state';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';
import { RangeType } from 'libs/constants/structures/range-type';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';

import * as fromModelSettingsModalActions from '../actions/model-settings-modal.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import * as fromSharedReducer from '../reducers';
import * as fromSharedStructuresReducer from '../reducers';
import { UrlService } from '../services';
import { Workflow } from '../constants/workflow';
import { PagesHelper } from '../helpers/pages.helper';

@Injectable()
export class ModelSettingsModalEffects {

  @Effect()
  cancelInNewWorkflow$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.CANCEL),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult, pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      filter(() => this.urlService.isInWorkflow(Workflow.NewRange)),
      map((data) => {
        const modelPageViewId =
          PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
        if (data.metadata.RangeTypeId === RangeType.Job) {
          return GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions);
        } else {
          return new fromPfDataGridActions.DoNothing(modelPageViewId);
        }
      })
    );

  @Effect({ dispatch: false })
  cancel$ = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.CANCEL),
      map(() => this.urlService.removeAllWorkflows())
    );

  @Effect()
  getCurrencies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.GET_CURRENCIES),
      switchMap(() =>
        this.currencyApiService.getCurrencies()
          .pipe(
            map((response) => {
              return new fromModelSettingsModalActions.GetCurrenciesSuccess(PayfactorsApiModelMapper.mapCurrencyDtosToCurrency(response));
            }),
            catchError(error => of(new fromModelSettingsModalActions.GetCurrenciesError()))
          )
      )
    );

  @Effect()
  getSurveyUdfs$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.GET_SURVEY_UDFS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext: UserContext) => ({ userContext })
      ),
      switchMap((data) =>
        this.surveyApiService.getUdfData(data.userContext.CompanyId)
          .pipe(
            map((response) => {
              return new fromModelSettingsModalActions.GetSurveyUdfsSuccess(PayfactorsApiModelMapper.mapSurveyUdfsToControlPoints(response.UdfSettings));
            }),
            catchError(error => of(new fromModelSettingsModalActions.GetSurveyUdfsError()))
          )
      )
    );

  @Effect()
  getStandardPayElements$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.GET_CONTROL_POINTS),
      switchMap(() =>
        this.compositeFieldsApiService.GetCompositeFieldsForStructuresModel()
          .pipe(
            map((response) => {
              return new fromModelSettingsModalActions.GetControlPointsSuccess(PayfactorsApiModelMapper.mapCompositeFieldsToControlPoints(response));
            }),
            catchError(error => of(new fromModelSettingsModalActions.GetControlPointsError()))
          )
      )
    );

  @Effect()
  getStructureNameSuggestions: Observable<Action> = this.actions$
    .pipe(
      ofType<fromModelSettingsModalActions.GetStructureNameSuggestions>(fromModelSettingsModalActions.GET_STRUCTURE_NAME_SUGGESTIONS),
      withLatestFrom(this.store.pipe(select(fromSharedReducer.getStructureNameSuggestionsAsyncObj)),
        (action, structureNames: AsyncStateObj<string[]>) => {
          return { action, names: structureNames.obj };
        }
      ),
      debounce((e) => e.names.length ? timer(300) : timer(100)),
      switchMap((e) =>
        this.structureModelingApiService.getStructureNameAutocompleteSuggestions(e.action.payload.filter)
          .pipe(
            map((response) => {
              return new fromModelSettingsModalActions.GetStructureNameSuggestionsSuccess(response);
            }),
            catchError(() => of(new fromModelSettingsModalActions.GetStructureNameSuggestionsError()))
          )
      )
    );

  constructor(
    private actions$: Actions,
    private currencyApiService: CurrencyApiService,
    private compositeFieldsApiService: CompositeFieldApiService,
    private structureModelingApiService: StructureModelingApiService,
    private surveyApiService: SurveyApiService,
    private urlService: UrlService,
    private store: Store<fromSharedReducer.State>
  ) { }
}
