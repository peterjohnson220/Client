import { Injectable } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { CountryApiService, CurrencyApiService, PayMarketApiService } from 'libs/data/payfactors-api';
import { KendoTypedDropDownItemHelper } from 'libs/models/kendo';

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

  constructor(
    private actions$: Actions,
    private countryApiService: CountryApiService,
    private currencyApiService: CurrencyApiService,
    private payMarketApiService: PayMarketApiService
  ) {}
}
