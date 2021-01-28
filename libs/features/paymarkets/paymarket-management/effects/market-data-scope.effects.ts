import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { MarketDataScopeApiService } from 'libs/data/payfactors-api';
import { autoGenerateListGroupValues } from 'libs/models/list';

import * as fromMdScopeActions from '../actions/market-data-scope.actions';

@Injectable()
export class MarketDataScopeEffects {
  @Effect()
  getSizes$ = this.actions$
    .pipe(
      ofType(fromMdScopeActions.GET_SIZES),
      switchMap((action: fromMdScopeActions.GetSizes) => {
        return this.marketDataScopeApiService.getAllScopeSizes()
          .pipe(
            map((response) => new fromMdScopeActions.GetSizesSuccess(autoGenerateListGroupValues(response)),
            catchError(() => of(new fromMdScopeActions.GetSizesError()))
          ));
      })
    );

  @Effect()
  getLocations$ = this.actions$
    .pipe(
      ofType(fromMdScopeActions.GET_LOCATIONS),
      switchMap((action: fromMdScopeActions.GetLocations) => {
        return this.marketDataScopeApiService.getGroupedListLocations(action.payload.request)
          .pipe(
            map((response) => new fromMdScopeActions.GetLocationsSuccess({
              results: response,
              reset: (!action.payload.request.Query || action.payload.request.Query.length === 0) && !action.payload.request.GeoLabel,
              locationExpandedKey: action.payload.locationExpandedKey
            })),
            catchError(() => of(new fromMdScopeActions.GetLocationsError()))
          );
      })
    );

  @Effect()
  getAllIndustries$ = this.actions$
    .pipe(
      ofType(fromMdScopeActions.GET_ALL_INDUSTRIES),
      switchMap((action: fromMdScopeActions.GetAllIndustries) => {
        return this.marketDataScopeApiService.getAllIndustries()
          .pipe(
            map((response) => new fromMdScopeActions.GetAllIndustriesSuccess(response)),
            catchError(() => of(new fromMdScopeActions.GetAllIndustriesError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private marketDataScopeApiService: MarketDataScopeApiService
  ) {}
}
