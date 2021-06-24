import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import { CurrencyApiService } from 'libs/data/payfactors-api/currency';
import { PayMarketApiService } from 'libs/data/payfactors-api/paymarket';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';

import * as fromStructuresPageActions from '../actions/structures-page.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class StructuresPageEffects {

  @Effect()
  deleteStructureModel$ = this.actions$
    .pipe(
      ofType(fromStructuresPageActions.DELETE_STRUCTURE_MODEL),
      switchMap((data: any) => {
        return this.structureRangeGroupApiService.deleteStructureModel(data.payload.rangeGroupIds).pipe(
          mergeMap(() => [
            new fromStructuresPageActions.DeleteStructureModelSuccess(),
            new fromPfDataGridActions.ClearSelections(data.payload.pageViewId),
            new fromPfDataGridActions.LoadData(data.payload.pageViewId),
            new fromStructuresPageActions.CloseDeletePayMarketModal()
          ]),
          catchError(() => {
            return of(new fromStructuresPageActions.DeleteStructureModelError());
          })
        );
      })
    );

  @Effect()
  loadCurrencies$ = this.actions$
    .pipe(
      ofType(fromStructuresPageActions.LOAD_CURRENCIES),
      switchMap(() => {
          return this.currencyApiService.getCurrencies().pipe(
            map((response) => {
              return new fromStructuresPageActions.LoadCurrenciesSuccess(
                PayfactorsApiModelMapper.mapItemsToDropdownList(response, 'CurrencyCode', (item => {
                  return `${item['CurrencyName']} (${item['CurrencyCode']})`;
                }))
              );
            }),
            catchError(() => of(new fromStructuresPageActions.LoadCurrenciesError()))
          );
        }
      )
    );

  @Effect()
  loadCompanyPayMarkets$: Observable<Action> = this.actions$.pipe(
    ofType(fromStructuresPageActions.LOAD_COMPANY_PAYMARKETS),
    switchMap(() => {
      return this.payMarketApiService.getAll().pipe(
        map(pm => new fromStructuresPageActions.LoadCompanyPayMarketsSuccess(pm)),
        catchError(error => {
          return of(new fromStructuresPageActions.LoadCompanyPayMarketsError());
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private structureRangeGroupApiService: StructureRangeGroupApiService,
    private currencyApiService: CurrencyApiService,
    private payMarketApiService: PayMarketApiService
  ) {}
}
