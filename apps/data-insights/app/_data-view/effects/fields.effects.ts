import { Injectable } from '@angular/core';

import { orderBy } from 'lodash';
import { select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, mergeMap, catchError, withLatestFrom, map, debounceTime, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { PfConstants } from 'libs/models/common';

import * as fromDataInsightsMainReducer from '../reducers';
import * as fromFieldsActions from '../actions/fields.actions';
import * as fromFiltersActions from '../actions/filters.actions';
import * as fromDataViewGridActions from '../actions/data-view-grid.actions';
import * as fromFormulaFieldModalActions from '../../_data-view/actions/formula-field.actions';
import { PayfactorsApiModelMapper, FieldsHelper } from '../helpers';
import { DataViewAccessLevel, Field } from '../models';

@Injectable()
export class FieldsEffects {

  @Effect()
  getReportFields$ = this.action$
  .pipe(
    ofType(fromFieldsActions.GET_REPORT_FIELDS),
    switchMap((action: fromFieldsActions.GetReportFields) => {
      return this.dataViewApiService.getUserDataViewFields(action.payload.dataViewId)
      .pipe(
        mergeMap((response) => [
            new fromFieldsActions.GetReportFieldsSuccess(
              PayfactorsApiModelMapper.mapDataViewFieldsToFields(response))
          ]
        ),
        catchError(() => of(new fromFieldsActions.GetReportFieldsError()))
      );
    })
  );

  @Effect()
  saveReportFields$ = this.action$
    .pipe(
      ofType(fromFieldsActions.SAVE_REPORT_FIELDS),
      debounceTime(PfConstants.DEBOUNCE_DELAY),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
        this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields)),
        (action: fromFieldsActions.SaveReportFields, userDataView, selectedFields) =>
          ({ userDataView, selectedFields })
      ),
      concatMap((data) => {
        const request = FieldsHelper.buildUpdateDataViewFieldsRequest(data.selectedFields, data.userDataView.obj);
        return this.dataViewApiService.updateDataViewFields(request)
          .pipe(
            map(() => new fromFieldsActions.SaveReportFieldsSuccess()),
            catchError(() => of(new fromFieldsActions.SaveReportFieldsError()))
          );
      })
    );

  @Effect()
  fieldsChanged$ = this.action$
    .pipe(
      ofType(
        fromFieldsActions.REORDER_FIELDS,
        fromFieldsActions.UPDATE_DISPLAY_NAME),
      map(() => {
        return new fromFieldsActions.SaveReportFields();
      })
    );

  @Effect()
  addSelectedField$ = this.action$
    .pipe(
      ofType(
        fromFieldsActions.ADD_SELECTED_FIELD,
        fromFieldsActions.SET_NUMBER_FORMAT_ON_SELECTED_FIELD,
        fromFieldsActions.SAVE_UPDATED_FORMULA_FIELD),
      mergeMap(() => {
        return [
          new fromFieldsActions.SaveReportFields(),
          new fromDataViewGridActions.GetData(),
          new fromDataViewGridActions.GetDataCount()
        ];
      })
    );

  @Effect()
  removeSelectedField$ = this.action$
    .pipe(
      ofType(fromFieldsActions.REMOVE_SELECTED_FIELD),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters)),
        this.store.pipe(select(fromDataInsightsMainReducer.getPendingFilters)),
        (action: fromFieldsActions.RemoveSelectedField, activeFilters, pendingFilters) =>
          ({ action, activeFilters, pendingFilters })
      ),
      mergeMap((data) => {
        const actions = [];
        const fieldToBeRemoved = data.action.payload;
        const activeFiltersContainField = FieldsHelper.fieldExistsInFilters(data.activeFilters, fieldToBeRemoved);
        const pendingFiltersContainField = FieldsHelper.fieldExistsInFilters(data.pendingFilters, fieldToBeRemoved);
        if (activeFiltersContainField) {
          actions.push(new fromFiltersActions.RemoveActiveFiltersByField(fieldToBeRemoved));
        }
        if (pendingFiltersContainField) {
          actions.push(new fromFiltersActions.RemovePendingFiltersByField(fieldToBeRemoved));
        }
        actions.push(new fromFieldsActions.SaveReportFields());
        actions.push(new fromDataViewGridActions.GetData());
        actions.push(new fromDataViewGridActions.GetDataCount());
        return actions;
      })
    );

  @Effect()
  createFormulaFieldSuccess$ = this.action$
    .pipe(
      ofType(fromFormulaFieldModalActions.CREATE_FORMULA_FIELD_SUCCESS),
      map((action: fromFormulaFieldModalActions.CreateFormulaFieldSuccess) => {
        const field: Field = PayfactorsApiModelMapper.mapDataViewFieldToField(action.payload);
        return new fromFieldsActions.AddNewFormulaField(field);
      })
    );

  @Effect()
  addNewFormulaField$ = this.action$
    .pipe(
      ofType(fromFieldsActions.ADD_NEW_FORMULA_FIELD),
      map((action: fromFieldsActions.AddNewFormulaField) => new fromFieldsActions.AddSelectedField(action.payload))
    );

  @Effect()
  updateFormulaFieldSuccess$ = this.action$
    .pipe(
      ofType(fromFormulaFieldModalActions.UPDATE_FORMULA_FIELD_SUCCESS),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters)),
        this.store.pipe(select(fromDataInsightsMainReducer.getPendingFilters)),
        this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields)),
        (action: fromFormulaFieldModalActions.UpdateFormulaFieldSuccess, activeFilters, pendingFilters, selectedFields) =>
          ({ action, activeFilters, pendingFilters, selectedFields })
      ),
      mergeMap((data) => {
        const actions = [];
        const field: Field = PayfactorsApiModelMapper.mapDataViewFieldToField(data.action.payload);
        const existingField = FieldsHelper.findField(data.selectedFields, field);
        if (!!existingField && existingField.DataType !== field.DataType) {
          if (FieldsHelper.fieldExistsInFilters(data.activeFilters, existingField)) {
            actions.push(new fromFiltersActions.RemoveActiveFiltersByField(existingField));
          }
          if (FieldsHelper.fieldExistsInFilters(data.pendingFilters, existingField)) {
            actions.push(new fromFiltersActions.RemovePendingFiltersByField(existingField));
          }
        }
        actions.push(new fromFieldsActions.SaveUpdatedFormulaField(field));
        return actions;
      })
    );

  @Effect()
  removeFormulaField$ = this.action$
    .pipe(
      ofType(fromFormulaFieldModalActions.DELETE_FORMULA_FIELD_SUCCESS),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields)),
        (action: fromFormulaFieldModalActions.DeleteFormulaFieldSuccess, selectedFields) =>
          ({ action, selectedFields })
      ),
      mergeMap((data) => {
        const actions = [];
        const existingField = FieldsHelper.findField(data.selectedFields, data.action.payload);
        if (!!existingField) {
          actions.push(new fromFieldsActions.RemoveSelectedField(existingField));
        }
        actions.push(new fromFieldsActions.RemoveFormulaField(data.action.payload));
        return actions;
      })
    );

  @Effect()
  sortField$ = this.action$
    .pipe(
      ofType(fromFieldsActions.SORT_FIELD),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
        (action: fromFieldsActions.SortField, userDataView) =>
          ({ action, userDataView })
      ),
      mergeMap(data => {
        const actions = [];
        actions.push(new fromDataViewGridActions.GetData());
        if (data.userDataView.obj.AccessLevel !== DataViewAccessLevel.ReadOnly) {
          actions.push(new fromFieldsActions.SaveReportFields());
        }
        return actions;
      })
    );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
