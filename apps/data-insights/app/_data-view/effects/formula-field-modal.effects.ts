import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { ValidateFormulaResponse, ValidateFormulaRequest, UpsertFormulaFieldRequest } from 'libs/models/payfactors-api/reports';

import * as fromFormulaFieldActions from '../actions/formula-field-modal.actions';

@Injectable()
export class FormulaFieldModalEffects {

  @Effect()
  validateFormula$ = this.actions$
    .pipe(
      ofType(fromFormulaFieldActions.VALIDATE_FORMULA),
      switchMap((action: fromFormulaFieldActions.ValidateFormula) => {
        const request: ValidateFormulaRequest = {
          BaseEntityId: action.payload.baseEntityId,
          Formula: action.payload.formula
        };
        return this.dataViewApiService.validateFormula(request)
          .pipe(
            map((response: ValidateFormulaResponse) => new fromFormulaFieldActions.ValidateFormulaSuccess({ result: response.IsValid })),
            catchError(() => of(new fromFormulaFieldActions.ValidateFormulaError()))
          );
      })
    );

  @Effect()
  saveFormulaField$ = this.actions$
    .pipe(
      ofType(fromFormulaFieldActions.SAVE_FORMULA_FIELD),
      switchMap((action: fromFormulaFieldActions.SaveFormulaField) => {
        const request: UpsertFormulaFieldRequest = {
          Name: action.payload.FieldName,
          Formula: action.payload.Formula,
          FormulaId: action.payload.FormulaId
        };
        return this.dataViewApiService.upsertFormulaField(request)
          .pipe(
            map((response) => {
              return action.payload.FormulaId
                ? new fromFormulaFieldActions.UpdateFormulaFieldSuccess(response)
                : new fromFormulaFieldActions.CreateFormulaFieldSuccess(response);
            }),
            catchError(response => {
              const message: string = response.status === 409
                ? 'Formula name in use. Please choose a unique formula name.'
                : 'Error Saving Formula.';
              return of(new fromFormulaFieldActions.SaveFormulaFieldError({ message }));
            })
          );
      })
    );

  constructor(
    private actions$: Actions,
    private dataViewApiService: DataViewApiService
  ) {}
}
