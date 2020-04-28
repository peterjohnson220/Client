import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';

import { MarketDataScopeApiService } from 'libs/data/payfactors-api';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromPayMarketsPageReducer from '../reducers';
import * as fromGridActionsBarActions from '../actions/grid-actions-bar.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import { PayMarketsPageViewId } from '../models';

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
              const multiSelectItemGroups = PayfactorsApiModelMapper.mapGroupedListItemsToMultiSelectItemGroups(response);
              return new fromGridActionsBarActions.GetCompanyScopeSizesSuccess(multiSelectItemGroups);
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


  constructor(
    private actions$: Actions,
    private marketDataScopeApiService: MarketDataScopeApiService,
    private store: Store<fromPayMarketsPageReducer.State>
  ) {}
}
