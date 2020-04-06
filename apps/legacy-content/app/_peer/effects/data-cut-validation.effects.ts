import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { ExchangeDataCutsApiService } from 'libs/data/payfactors-api/peer';
import { DataCutValidationInfo } from 'libs/models/peer';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import * as fromPeerMapReducers from 'libs/features/peer/map/reducers/';
import * as fromDataCutValidationActions from 'libs/features/peer/actions/data-cut-validation.actions';

@Injectable()
export class DataCutValidationEffects {
  @Effect()
  loadDataCutValidationInfo: Observable<Action> = this.actions$.pipe(
    ofType(fromDataCutValidationActions.LOAD_DATA_CUT_VALIDATION),
    map((action: fromDataCutValidationActions.LoadDataCutValidation) => action.payload),
    switchMap(payload => {
      return this.exchangeDataCutsApiService.getDataCutValidationInfo(payload).pipe(
        map((response: DataCutValidationInfo[]) => new fromDataCutValidationActions.LoadDataCutValidationSuccess(response)),
        catchError(() => of(new fromDataCutValidationActions.LoadDataCutValidationError))
      );
    })
  );

  @Effect()
  validateCutEmployeeSimilarity$ = this.actions$.pipe(
    ofType(fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES),
    withLatestFrom(
      this.peerMapStore.pipe(select(fromPeerMapReducers.getExchangeDataCutRequestData)),
      (action: fromDataCutValidationActions.ValidateDataCutEmployees, filters) =>
        ({ action, filters })),
    switchMap((data) => {
      return this.exchangeDataCutsApiService.validateCutEmployeeSimilarity(data.filters,
        data.action.companyJobId, data.action.userSessionId, data.action.dataCutGuid).pipe(
          map((response: boolean) => new fromDataCutValidationActions.ValidateDataCutEmployeesSuccess(response)),
          catchError(() => of(new fromDataCutValidationActions.ValidateDataCutEmployeesError))
        );
    })
  );

  @Effect()
  validateCutEmployeeSimilarityNew$ = this.actions$.pipe(
    ofType(fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES_NEW),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      (action: fromDataCutValidationActions.ValidateDataCutEmployeesNew, filters) =>
        ({ action, filters })),
    switchMap((data) => {
      return this.exchangeDataCutsApiService.validateCutEmployeeSimilarityNew(data.filters,
        data.action.companyJobId, data.action.userSessionId, data.action.dataCutGuid).pipe(
        map((response: boolean) => new fromDataCutValidationActions.ValidateDataCutEmployeesSuccess(response)),
        catchError(() => of(new fromDataCutValidationActions.ValidateDataCutEmployeesError))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private peerMapStore: Store<fromPeerMapReducers.State>
  ) { }
}
