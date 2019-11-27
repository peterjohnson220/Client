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
import { PayfactorsApiModelMapper } from '../helpers';

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
        const selectedFields = orderBy(data.selectedFields, 'Order');
        const fieldsToSave = selectedFields.map((f, index) => {
          return {
            DataElementId: f.DataElementId,
            Order: index + 1,
            DisplayName: f.DisplayName
          };
        });
        return this.dataViewApiService.updateDataViewFields({
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          Fields: fieldsToSave
        })
          .pipe(
            map(() => {
              return new fromFieldsActions.SaveReportFieldsSuccess();
            }),
            catchError(() => {
              return of(new fromFieldsActions.SaveReportFieldsError());
            })
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
        const activeFiltersContainField = data.activeFilters.some(f => f.Field.DataElementId === fieldToBeRemoved.DataElementId);
        const pendingFiltersContainField = data.pendingFilters.some(f => f.Field.DataElementId === fieldToBeRemoved.DataElementId);
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

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
