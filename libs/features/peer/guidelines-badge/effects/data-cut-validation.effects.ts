import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { ExchangeDataCutsApiService } from 'libs/data/payfactors-api/peer';
import { DataCutValidationInfo } from 'libs/models/peer';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import * as fromDataCutValidationActions from 'libs/features/peer/actions/data-cut-validation.actions';

import * as fromDataCutValidationReducer from '../reducers';

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
      this.exchangeExplorerContextService.selectFilterContext(),
      (action: fromDataCutValidationActions.ValidateDataCutEmployees, filters) => ({ payload: action.payload, filters})),
    switchMap((data: any) => {
      let response: Observable<boolean>;
      if (!!data.payload.entityConfiguration) {
        const companyJobValidationPayload = data.payload;
        response = this.exchangeDataCutsApiService.validateCutEmployeeSimilarity(
          data.filters,
          companyJobValidationPayload.companyJobId,
          companyJobValidationPayload.entityConfiguration,
          companyJobValidationPayload.dataCutGuid);
      } else {
        const tempDataCutValidationPayload = data.payload;
        response = this.exchangeDataCutsApiService.validateTempCutEmployeeSimilarity(
          data.filters, tempDataCutValidationPayload.existingDataCutGuids, tempDataCutValidationPayload.tempExchangeJobDataCutFilterContexts);
      }
      return response.pipe(map((success: boolean) => new fromDataCutValidationActions.ValidateDataCutEmployeesSuccess(success)),
        catchError(() => of(new fromDataCutValidationActions.ValidateDataCutEmployeesError))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataCutValidationReducer.State>,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) { }
}
