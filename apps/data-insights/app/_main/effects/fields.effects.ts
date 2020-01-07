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
import * as fromFormulaFieldModalActions from '../../_data-view/actions/formula-field-modal.actions';
import { PayfactorsApiModelMapper, FieldsHelper } from '../helpers';
import { Field } from '../models';

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
      ofType(fromFieldsActions.ADD_SELECTED_FIELD),
      mergeMap(() => {
        return [
          new fromFieldsActions.SaveReportFields(),
          new fromDataViewGridActions.GetData()
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

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
