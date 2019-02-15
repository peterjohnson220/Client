import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { ExchangeDataCutsApiService } from 'libs/data/payfactors-api/peer';
import { DataCutValidationInfo } from 'libs/models/peer';

import * as fromDataCutValidationActions from '../actions/data-cut-validation.actions';

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

  constructor(
    private actions$: Actions,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService
  ) {}
}
