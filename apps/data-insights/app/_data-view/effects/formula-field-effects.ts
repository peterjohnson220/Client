import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { ValidateFormulaResponse, ValidateFormulaRequest, UpsertFormulaFieldRequest, DeleteUserFormulaRequest } from 'libs/models/payfactors-api/reports';

import * as fromFormulaFieldActions from '../actions/formula-field.actions';
import { PayfactorsApiModelMapper } from '../helpers';


@Injectable()
export class FormulaFieldEffects {

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
            map((response: ValidateFormulaResponse) => new fromFormulaFieldActions.ValidateFormulaSuccess({
              result: response.IsValid,
              dataType: PayfactorsApiModelMapper.mapDataViewFieldDataTypeToFieldDataType(response.DataType)
            })),
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
          Name: action.payload.formula.FieldName,
          Formula: action.payload.formula.Formula,
          FormulaId: action.payload.formula.FormulaId,
          BaseEntityId: action.payload.baseEntityId,
          DataType: action.payload.formula.DataType,
          IsPublic: action.payload.formula.IsPublic,
        };
        return this.dataViewApiService.upsertFormulaField(request)
          .pipe(
            map((response) => {
              return action.payload.formula.FormulaId
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

  @Effect()
  getFormulaViewCount$ = this.actions$
    .pipe(
      ofType(fromFormulaFieldActions.GET_FORMULA_FIELD_VIEW_COUNT),
      switchMap((action: fromFormulaFieldActions.GetFormulaFieldViewCount) => {
        return this.dataViewApiService.getDataViewCountForFormula(action.payload)
          .pipe(
            map((response: number) => new fromFormulaFieldActions.GetFormulaFieldViewCountSuccess(response)),
            catchError(() => of(new fromFormulaFieldActions.GetFormulaFieldViewCountError()))
          );
      })
    );

  @Effect()
  deleteFormulaField$ = this.actions$
    .pipe(
      ofType(fromFormulaFieldActions.DELETE_FORMULA_FIELD),
      switchMap((action: fromFormulaFieldActions.DeleteFormulaField) => {
        const request: DeleteUserFormulaRequest = {
          FormulaId: action.payload.FormulaId
        };
        return this.dataViewApiService.deleteFormulaField(request)
          .pipe(
            map(() => new fromFormulaFieldActions.DeleteFormulaFieldSuccess(action.payload)),
            catchError(() => of(new fromFormulaFieldActions.DeleteFormulaFieldError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private dataViewApiService: DataViewApiService
  ) {}
}
