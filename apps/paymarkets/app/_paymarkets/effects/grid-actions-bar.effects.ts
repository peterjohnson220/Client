import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';

import { MarketDataScopeApiService } from 'libs/data/payfactors-api';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromPayMarketsPageReducer from '../reducers';
import * as fromGridActionsBarActions from '../actions/grid-actions-bar.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import { PayMarketsPageViewId } from '../models';
import { autoGenerateListGroupValues } from 'libs/models/list/grouped-list-item.model';

@Injectable()
export class GridActionsBarEffects {

  @Effect()
  getCompanyScopeSizes$ = this.actions$
    .pipe(
      ofType(fromGridActionsBarActions.GET_COMPANY_SCOPE_SIZES),
      switchMap((action: fromGridActionsBarActions.GetCompanyScopeSizes) => {
        return this.marketDataScopeApiService.getCompanyScopeSizes()
          .pipe(
            map((response) => {
              return new fromGridActionsBarActions.GetCompanyScopeSizesSuccess(autoGenerateListGroupValues(response));
            }),
            catchError(() => of(new fromGridActionsBarActions.GetCompanyScopeSizesError()))
          );
      })
    );

  @Effect()
  updateSelectedSizes$ = this.actions$
    .pipe(
      ofType(fromGridActionsBarActions.UPDATE_SELECTED_SIZES),
      withLatestFrom(
        this.store.pipe(select(fromPfDataGridReducer.getFields)),
        this.store.pipe(select(fromPayMarketsPageReducer.getSelectedSizes)),
        (action, fields, selectedSizes) => ({ action, fields, selectedSizes })
      ),
      map(data => {
        const sizeField = PayfactorsApiModelMapper.applySelectedItemsToField(data.fields, 'ScopeSize', data.selectedSizes);
        if (data.selectedSizes && data.selectedSizes.length) {
          return new fromPfDataGridActions.UpdateFilter(PayMarketsPageViewId, sizeField);
        } else {
          return new fromPfDataGridActions.ClearFilter(PayMarketsPageViewId, sizeField, true);
        }
      })
    );

   @Effect()
  getCompanyIndustries$ = this.actions$
    .pipe(
      ofType(fromGridActionsBarActions.GET_COMPANY_INDUSTRIES),
      switchMap((action: fromGridActionsBarActions.GetCompanyIndustries) => {
        return this.marketDataScopeApiService.getDistinctIndustries()
          .pipe(
            map((response) => new fromGridActionsBarActions.GetCompanyIndustriesSuccess(response)),
            catchError(() => of(new fromGridActionsBarActions.GetCompanyIndustriesError()))
          );
      })
    );

  @Effect()
  setSelectedIndustries = this.actions$
    .pipe(
      ofType(fromGridActionsBarActions.SET_SELECTED_INDUSTRIES),
      withLatestFrom(
        this.store.pipe(select(fromPfDataGridReducer.getFields)),
        this.store.pipe(select(fromPayMarketsPageReducer.getSelectedIndustries)),
        (action, fields, selectedIndustries) => ({ action, fields, selectedIndustries })
      ),
      map(data => {
        const industryField = PayfactorsApiModelMapper.applySelectedItemsToField(data.fields, 'Industry_Value', data.selectedIndustries);
        if (data.selectedIndustries && data.selectedIndustries.length) {
          return new fromPfDataGridActions.UpdateFilter(PayMarketsPageViewId, industryField);
        } else {
          return new fromPfDataGridActions.ClearFilter(PayMarketsPageViewId, industryField, true);
        }
      })
    );

  @Effect()
  getLocations$ = this.actions$
    .pipe(
      ofType(fromGridActionsBarActions.GET_LOCATIONS),
      switchMap((action: fromGridActionsBarActions.GetLocations) => {
        return this.marketDataScopeApiService.getCompanyScopeGeo()
          .pipe(
            map((response) => new fromGridActionsBarActions.GetLocationsSuccess(response)),
            catchError(() => of(new fromGridActionsBarActions.GetLocationsError()))
          );
      })
    );

  @Effect()
  setSelectedLocations$ = this.actions$
    .pipe(
      ofType(fromGridActionsBarActions.SET_SELECTED_LOCATIONS),
      withLatestFrom(
        this.store.pipe(select(fromPfDataGridReducer.getFields)),
        this.store.pipe(select(fromPayMarketsPageReducer.getSelectedLocations)),
        (action, fields, selectedLocations) => ({ action, fields, selectedLocations })
      ),
      map(data => {
        const locationField = PayfactorsApiModelMapper.applySelectedItemsToField(data.fields, 'Geo_Value', data.selectedLocations);
        if (data.selectedLocations && data.selectedLocations.length) {
          return new fromPfDataGridActions.UpdateFilter(PayMarketsPageViewId, locationField);
        } else {
          return new fromPfDataGridActions.ClearFilter(PayMarketsPageViewId, locationField, true);
        }
      })
    );


  constructor(
    private actions$: Actions,
    private marketDataScopeApiService: MarketDataScopeApiService,
    private store: Store<fromPayMarketsPageReducer.State>
  ) {}
}
