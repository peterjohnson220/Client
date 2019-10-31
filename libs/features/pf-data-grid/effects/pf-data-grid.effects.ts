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
import { SortDescriptor } from '@progress/kendo-data-query';


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
            ofType(
                fromPfDataGridActions.LOAD_DATA,
                fromPfDataGridActions.UPDATE_PAGING_OPTIONS,
                fromPfDataGridActions.UPDATE_SORT_DESCRIPTOR,
                fromPfDataGridActions.UPDATE_INBOUND_FILTERS),
            mergeMap((loadDataAction: fromPfDataGridActions.LoadData) =>
                of(loadDataAction).pipe(
                    withLatestFrom(
                        this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getFields, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getInboundFilters, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getFilters, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, loadDataAction.pageViewId)),
                        (action: fromPfDataGridActions.LoadData, baseEntity, fields, inboundFilters, filters, pagingOptions, sortDescriptor) =>
                            ({ action, baseEntity, fields, inboundFilters, filters, pagingOptions, sortDescriptor })
                    )
                ),
            ),
            switchMap((data) => {
                if (data.fields) {
                    return this.dataViewApiService
                        .getDataWithCount(PfDataGridEffects.buildDataViewDataRequest(
                            data.baseEntity ? data.baseEntity.Id : null,
                            data.fields,
                            data.filters.concat(data.inboundFilters),
                            data.pagingOptions,
                            data.sortDescriptor))
                        .pipe(
                            map((response: DataViewEntityResponseWithCount) => new fromPfDataGridActions.LoadDataSuccess(data.action.pageViewId, response)),
                            catchError(error => {
                                const msg = 'We encountered an error while loading your data';
                                return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
                            })
                        );
                } else {
                    return of(new fromPfDataGridActions.ClearLoading(data.action.pageViewId));
                }
            }

            )
        );

    @Effect()
    saveView$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.UPDATE_FIELDS),
            mergeMap((updateFieldsAction: fromPfDataGridActions.UpdateFields) =>
                of(updateFieldsAction).pipe(
                    withLatestFrom(
                        this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, updateFieldsAction.pageViewId)),
                        (action: fromPfDataGridActions.UpdateFields, baseEntity) =>
                            ({ action, baseEntity })
                    )
                ),
            ),
            switchMap((data) =>
                this.dataViewApiService.updateDataView(PfDataGridEffects
                    .buildSaveDataViewRequest(data.action.pageViewId, data.baseEntity.Id, data.action.fields))
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
            mergeMap((action: any) => {
                return [
                    new fromPfDataGridActions.UpdatePagingOptions(action.pageViewId, fromPfDataGridReducer.DEFAULT_PAGING_OPTIONS),
                    new fromPfDataGridActions.LoadData(action.pageViewId)
                ];
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

    static buildDataViewDataRequest(
        baseEntityId: number, fields: ViewField[], filters: DataViewFilter[],
        pagingOptions: PagingOptions, sortDescriptor: SortDescriptor[]) {

        let singleSortDesc = null;
        if (!!sortDescriptor && sortDescriptor.length > 0) {
            const field: ViewField = fields.find(x => sortDescriptor[0].field === `${x.EntitySourceName}_${x.SourceName}`);
            singleSortDesc = {
                SortField: field,
                SortDirection: sortDescriptor[0].dir
            };
        }

        return {
            BaseEntityId: baseEntityId,
            Fields: PfDataGridEffects.mapFieldsToDataViewFields(fields),
            Filters: filters,
            PagingOptions: pagingOptions,
            SortDescriptor: singleSortDesc,
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
