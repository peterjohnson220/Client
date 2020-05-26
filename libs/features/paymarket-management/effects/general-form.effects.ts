import { Injectable } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { CountryApiService, CurrencyApiService, PayMarketApiService, MarketDataScopeApiService } from 'libs/data/payfactors-api';
import { KendoTypedDropDownItemHelper } from 'libs/models/kendo';
import { autoGenerateListGroupValues } from 'libs/models/list';

import * as fromGeneralFormActions from '../actions/general-form.actions';

@Injectable()
export class GeneralFormEffects {

  @Effect()
  getCountries$ = this.actions$
    .pipe(
      ofType(fromGeneralFormActions.GET_COUNTRIES),
      switchMap((action: fromGeneralFormActions.GetCountries) => {
        return this.countryApiService.getAllCountryCurrency()
          .pipe(
            map((response) => {
              return new fromGeneralFormActions.GetCountriesSuccess(
                KendoTypedDropDownItemHelper.mapItemsToDropdownList(response, 'CountryCode', (item => {
                  return `${item['CountryCode']} - ${item['CurrencyCode']}`;
                }))
              );
            }),
            catchError(() => of(new fromGeneralFormActions.GetCountriesError()))
          );
      })
    );

  @Effect()
  getCurrencies$ = this.actions$
    .pipe(
      ofType(fromGeneralFormActions.GET_CURRENCIES),
      switchMap(() => {
          return this.currencyApiService.getCurrencies().pipe(
            map((response) => {
              return new fromGeneralFormActions.GetCurrenciesSuccess(
                KendoTypedDropDownItemHelper.mapItemsToDropdownList(response, 'CurrencyCode', (item => {
                  const currencySymbol = getCurrencySymbol(item['CurrencyCode'], 'narrow');
                  return `${item['CurrencyCode']} (${currencySymbol})`;
                }))
              );
            }),
            catchError(() => of(new fromGeneralFormActions.GetCurrenciesError()))
          );
        }
      )
    );

  @Effect()
  getLinkedPayMarkets$ = this.actions$
    .pipe(
      ofType(fromGeneralFormActions.GET_LINKED_PAY_MARKETS),
      switchMap((action: fromGeneralFormActions.GetLinkedPayMarkets) => {
        return this.payMarketApiService.getAvailablePayMarketsToCreateLink(action.payload.payMarketId)
          .pipe(
            map((response) => new fromGeneralFormActions.GetLinkedPayMarketsSuccess(
              KendoTypedDropDownItemHelper.mapToDropdownList(response, 'CompanyPayMarketId', 'PayMarket'))),
            catchError(() => of(new fromGeneralFormActions.GetLinkedPayMarketsError()))
          );
      })
    );

  @Effect()
  getSizes$ = this.actions$
    .pipe(
      ofType(fromGeneralFormActions.GET_SIZES),
      switchMap((action: fromGeneralFormActions.GetSizes) => {
        return this.marketDataScopeApiService.getAllScopeSizes()
          .pipe(
            map((response) => new fromGeneralFormActions.GetSizesSuccess(autoGenerateListGroupValues(response)),
            catchError(() => of(new fromGeneralFormActions.GetSizesError()))
          ));
      })
    );

  @Effect()
  getDefaultPayMarket$ = this.actions$
    .pipe(
      ofType(fromGeneralFormActions.GET_DEFAULT_USER_PAY_MARKET),
      switchMap((action: fromGeneralFormActions.GetDefaultUserPayMarket) => {
        return this.payMarketApiService.getDefaultUserPayMarket()
          .pipe(
            map((response) => new fromGeneralFormActions.GetDefaultUserPayMarketSuccess(response)),
            catchError(() => of(new fromGeneralFormActions.GetDefaultUserPayMarketError()))
          );
      })
    );

  @Effect()
  getLocations$ = this.actions$
    .pipe(
      ofType(fromGeneralFormActions.GET_LOCATIONS),
      switchMap((action: fromGeneralFormActions.GetLocations) => {
        return this.marketDataScopeApiService.getGroupedListLocations(action.payload.request)
          .pipe(
            map((response) => new fromGeneralFormActions.GetLocationsSuccess({
              results: response,
              reset: (!action.payload.request.Query || action.payload.request.Query.length === 0) && !action.payload.request.GeoLabel,
              locationExpandedKey: action.payload.locationExpandedKey
            })),
            catchError(() => of(new fromGeneralFormActions.GetLocationsError()))
          );
      })
    );

  @Effect()
  getAllIndustries$ = this.actions$
    .pipe(
      ofType(fromGeneralFormActions.GET_ALL_INDUSTRIES),
      switchMap((action: fromGeneralFormActions.GetAllIndustries) => {
        return this.marketDataScopeApiService.getAllIndustries()
          .pipe(
            map((response) => new fromGeneralFormActions.GetAllIndustriesSuccess(response)),
            catchError(() => of(new fromGeneralFormActions.GetAllIndustriesError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private countryApiService: CountryApiService,
    private currencyApiService: CurrencyApiService,
    private payMarketApiService: PayMarketApiService,
    private marketDataScopeApiService: MarketDataScopeApiService
  ) {}
}
