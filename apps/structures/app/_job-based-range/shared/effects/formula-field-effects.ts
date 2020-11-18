import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, groupBy, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { PayfactorsApiModelMapper } from 'libs/features/formula-editor';
import { ValidateFormulaResponse, ValidateFormulaRequest, UpsertFormulaFieldRequest, DeleteUserFormulaRequest } from 'libs/models/payfactors-api/reports';
import * as fromFormulaFieldActions from 'libs/features/formula-editor/actions/formula-field.actions';


@Injectable()
export class FormulaFieldEffects {

  @Effect()
  validateFormula$ = this.actions$
    .pipe(
      ofType(fromFormulaFieldActions.VALIDATE_FORMULA),
      groupBy((action: fromFormulaFieldActions.ValidateFormula) => action.payload.formulaFieldId),
      mergeMap(formulaFieldIdGroup => formulaFieldIdGroup.pipe(
        switchMap((action: fromFormulaFieldActions.ValidateFormula) => {
          const request: ValidateFormulaRequest = {
            BaseEntityId: action.payload.baseEntityId,
            Formula: action.payload.formula
          };
          return this.dataViewApiService.validateFormula(request)
            .pipe(
              map((response: ValidateFormulaResponse) => new fromFormulaFieldActions.ValidateFormulaSuccess({
                result: response.IsValid,
                dataType: PayfactorsApiModelMapper.mapDataViewFieldDataTypeToFieldDataType(response.DataType),
                formulaFieldId: action.payload.formulaFieldId
              })),
              catchError(() => of(new fromFormulaFieldActions.ValidateFormulaError({ formulaFieldId: action.payload.formulaFieldId })))
            );
        })
      ))
    );


  @Effect()
  saveFormulaField$ = this.actions$
    .pipe(
      ofType(fromFormulaFieldActions.SAVE_FORMULA_FIELD),
      groupBy((action: fromFormulaFieldActions.SaveFormulaField) => action.payload.formulaFieldId),
      mergeMap(formulaFieldIdGroup => formulaFieldIdGroup.pipe(
        switchMap((action: fromFormulaFieldActions.SaveFormulaField) => {
          const request: UpsertFormulaFieldRequest = {
            Name: action.payload.formula.FieldName,
            Formula: action.payload.formula.Formula,
            FormulaId: action.payload.formula.FormulaId,
            BaseEntityId: action.payload.baseEntityId,
            DataType: action.payload.formula.DataType,
            IsPublic: action.payload.formula.IsPublic ?? true,
          };
          return this.dataViewApiService.upsertFormulaField(request)
            .pipe(
              map((response) => {
                return action.payload.formula.FormulaId
                  ? new fromFormulaFieldActions.UpdateFormulaFieldSuccess({ dataViewField: response, formulaFieldId: action.payload.formulaFieldId })
                  : new fromFormulaFieldActions.CreateFormulaFieldSuccess({ dataViewField: response, formulaFieldId: action.payload.formulaFieldId });
              }),
              catchError(response => {
                const message: string = response.status === 409
                  ? 'Formula name must be unique.'
                  : 'Error Saving Formula.';
                return of(new fromFormulaFieldActions.SaveFormulaFieldError({ message: message, formulaFieldId: action.payload.formulaFieldId }));
              })
            );
        })
      ))
    );

  constructor(
    private actions$: Actions,
    private dataViewApiService: DataViewApiService
  ) {}
}
