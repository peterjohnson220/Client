import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import {
    ViewField,
    DataViewConfig,
    SaveDataViewRequest,
    DataViewField,
    DataViewFilter,
    DataViewEntityResponseWithCount,
    PagingOptions
} from 'libs/models/payfactors-api';
import { DataViewApiService } from 'libs/data/payfactors-api';

import * as fromPfDataGridActions from '../actions';
import * as fromPfDataGridReducer from '../reducers';


@Injectable()
export class PfDataGridEffects {
    constructor(private actions$: Actions,
        private dataViewApiService: DataViewApiService,
        private store: Store<fromPfDataGridReducer.State>
    ) { }

    @Effect()
    loadViewConfig$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.LOAD_VIEW_CONFIG),
            switchMap(
                (action: fromPfDataGridActions.LoadViewConfig) =>
                    this.dataViewApiService.getDataViewConfig(action.pageViewId).pipe(
                        mergeMap((viewConfig: DataViewConfig) => {
                            return [
                                new fromPfDataGridActions.LoadViewConfigSuccess(action.pageViewId, viewConfig),
                                new fromPfDataGridActions.LoadData(action.pageViewId)
                            ];
                        }),
                        catchError(error => {
                            const msg = 'We encountered an error while loading the data fields.';
                            return of(new fromPfDataGridActions.HandleApiError(action.pageViewId, msg));
                        })
                    )
            )
        );

    @Effect()
    loadData$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.LOAD_DATA, fromPfDataGridActions.UPDATE_PAGING_OPTIONS),
            mergeMap((loadDataAction: fromPfDataGridActions.LoadData) =>
                of(loadDataAction).pipe(
                    withLatestFrom(
                        this.store.pipe(select(fromPfDataGridReducer.getBaseEntityId, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getFields, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getFilters, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, loadDataAction.pageViewId)),
                        (action: fromPfDataGridActions.LoadData, baseEntityId, fields, filters, pagingOptions) =>
                            ({ action, baseEntityId, fields, filters, pagingOptions })
                    )
                ),
            ),
            switchMap((data) =>
                this.dataViewApiService
                    .getDataWithCount(PfDataGridEffects.buildDataViewDataRequest(data.baseEntityId, data.fields, data.filters, data.pagingOptions))
                    .pipe(
                        map((response: DataViewEntityResponseWithCount) => new fromPfDataGridActions.LoadDataSuccess(data.action.pageViewId, response)),
                        catchError(error => {
                            const msg = 'We encountered an error while loading your data';
                            return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
                        })
                    )
            )
        );

    @Effect()
    saveView$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.UPDATE_FIELDS),
            mergeMap((updateFieldsAction: fromPfDataGridActions.UpdateFields) =>
                of(updateFieldsAction).pipe(
                    withLatestFrom(
                        this.store.pipe(select(fromPfDataGridReducer.getBaseEntityId, updateFieldsAction.pageViewId)),
                        (action: fromPfDataGridActions.UpdateFields, baseEntityId) =>
                            ({ action, baseEntityId })
                    )
                ),
            ),
            switchMap((data) =>
                this.dataViewApiService.updateDataView(PfDataGridEffects
                    .buildSaveDataViewRequest(data.action.pageViewId, data.baseEntityId, data.action.fields))
                    .pipe(
                        map((response: any[]) => {
                            return new fromPfDataGridActions.UpdateFieldsSuccess(data.action.pageViewId);
                        }),
                        catchError(error => {
                            const msg = 'We encountered an error while loading your data';
                            return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
                        })
                    )
            )
        );

    @Effect()
    filterChanges$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.UPDATE_FILTER, fromPfDataGridActions.CLEAR_FILTER, fromPfDataGridActions.CLEAR_ALL_FILTERS),
            map((action: any) => {
                return new fromPfDataGridActions.LoadData(action.pageViewId);
            })
        );

    static buildSaveDataViewRequest(pageViewId: string, baseEntityId: number, fields: ViewField[]): SaveDataViewRequest {
        return <SaveDataViewRequest>{
            PageViewId: pageViewId,
            EntityId: baseEntityId,
            Elements: fields.
                filter(e => e.IsSelected).
                map(e => ({ ElementId: e.DataElementId }))
        };
    }

    static buildDataViewDataRequest(baseEntityId: number, fields: ViewField[], filters: DataViewFilter[], pagingOptions: PagingOptions) {
        return {
            BaseEntityId: baseEntityId,
            Fields: PfDataGridEffects.mapFieldsToDataViewFields(fields),
            Filters: filters,
            PagingOptions: pagingOptions,
            SortDescriptor: null,
            WithCount: true
        };
    }

    static mapFieldsToDataViewFields(fields: ViewField[]): DataViewField[] {
        return fields ? fields.map(f => {
            return {
                EntityId: f.EntityId,
                Entity: null,
                EntitySourceName: f.EntitySourceName,
                DataElementId: f.DataElementId,
                SourceName: f.SourceName,
                DisplayName: f.DisplayName,
                DataType: f.DataType,
                IsSelected: f.IsSelected,
                IsSortable: false,
                Order: f.Order
            };
        })
            : [];
    }

}
