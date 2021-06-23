import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, mergeMap, tap } from 'rxjs/operators';
import orderBy from 'lodash/orderBy';

import { StructureRangeGroupApiService, StructuresApiService } from 'libs/data/payfactors-api/structures';
import { CurrencyApiService } from 'libs/data/payfactors-api/currency';
import { PayMarketApiService } from 'libs/data/payfactors-api/paymarket';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { RangeType } from 'libs/constants/structures/range-type';

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
        map(pm => {
          const payMarkets = orderBy(pm, ['PayMarket', 'asc']);
          return new fromStructuresPageActions.LoadCompanyPayMarketsSuccess(payMarkets);
        }),
        catchError(error => {
          return of(new fromStructuresPageActions.LoadCompanyPayMarketsError());
        })
      );
    })
  );

  @Effect()
  loadCompanyStructures$: Observable<Action> = this.actions$.pipe(
    ofType(fromStructuresPageActions.LOAD_COMPANY_STRUCTURES),
    switchMap(() => {
      return this.structureApiService.getAllCompanyStructures().pipe(
        map((response) => new fromStructuresPageActions.LoadCompanyStructuresSuccess(response)),
        catchError(() => of(new fromStructuresPageActions.LoadCompanyStructuresError()))
      );
    })
  );

  @Effect()
  loadRangeDistributionTypes$: Observable<Action> = this.actions$.pipe(
    ofType(fromStructuresPageActions.LOAD_RANGE_DISTRIBUTION_TYPES),
    switchMap(() => {
      return this.structureRangeGroupApiService.getRangeDistributionTypes().pipe(
        map((response) => new fromStructuresPageActions.LoadRangeDistributionTypesSuccess(response)),
        catchError(() => of(new fromStructuresPageActions.LoadRangeDistributionTypesError()))
      );
    })
  );

  @Effect()
  createStructure$: Observable<Action> = this.actions$.pipe(
    ofType(fromStructuresPageActions.CREATE_STRUCTURE),
    switchMap((action: fromStructuresPageActions.CreateStructure) => {
      return this.structureRangeGroupApiService.createRangeGroup(action.payload).pipe(
        mergeMap((response) => {
          const actions = [];
          if (response) {
            const rangeType: string = action.payload.RangeTypeId === RangeType.Job ? 'job' : 'grade';
            actions.push(new fromStructuresPageActions.CreateStructureSuccess({ rangeType,  rangeGroupId: response }));
            actions.push(new fromStructuresPageActions.ShowStructureForm(false));
          } else {
            actions.push(new fromStructuresPageActions.CreateStructureError({ errorMessage: 'Model Name Must Be Unique to the Structure' }));
          }
          return actions;
        }),
        catchError(() => of(new fromStructuresPageActions.CreateStructureError({ errorMessage: 'Error saving structure.'})))
      );
    })
  );

  @Effect({dispatch: false})
  createStructureSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromStructuresPageActions.CREATE_STRUCTURE_SUCCESS),
    tap((action: fromStructuresPageActions.CreateStructureSuccess) => {
      this.router.navigate([`/${action.payload.rangeType}/${action.payload.rangeGroupId}/new`]);
    })
  );

  constructor(
    private actions$: Actions,
    private structureRangeGroupApiService: StructureRangeGroupApiService,
    private currencyApiService: CurrencyApiService,
    private payMarketApiService: PayMarketApiService,
    private structureApiService: StructuresApiService,
    private router: Router
  ) {}
}
