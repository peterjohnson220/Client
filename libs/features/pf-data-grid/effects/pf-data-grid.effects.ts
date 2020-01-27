import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { SortDescriptor } from '@progress/kendo-data-query';

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
import { getUserFilteredFields, isValueRequired } from '../components';


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
                    this.dataViewApiService.getDataViewConfig(PfDataGridEffects.parsePageViewId(action.pageViewId), action.name).pipe(
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
                fromPfDataGridActions.UPDATE_PAGING_OPTIONS),
            mergeMap((loadDataAction: fromPfDataGridActions.LoadData) =>
                of(loadDataAction).pipe(
                    withLatestFrom(
                        this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getFields, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, loadDataAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getApplyDefaultFilters, loadDataAction.pageViewId)),
                        (action: fromPfDataGridActions.LoadData, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters) =>
                            ({ action, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters})
                    )
                ),
            ),
            switchMap((data) => {
                if (data.fields) {
                    return this.dataViewApiService
                        .getDataWithCount(PfDataGridEffects.buildDataViewDataRequest(
                            data.baseEntity ? data.baseEntity.Id : null,
                            data.fields,
                            PfDataGridEffects.mapFieldsToFilters(data.fields),
                            data.pagingOptions,
                            data.sortDescriptor,
                            data.pagingOptions && data.pagingOptions.From === 0,
                            data.applyDefaultFilters))
                        .pipe(
                            map((response: DataViewEntityResponseWithCount) => new fromPfDataGridActions.LoadDataSuccess(data.action.pageViewId, response)),
                            catchError(error => {
                                const msg = 'We encountered an error while loading your data';
                                return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
                            })
                        );
                } else {
                    return of(new fromPfDataGridActions.DoNothing(data.action.pageViewId));
                }
            }

            )
        );

    @Effect()
    updateFields$: Observable<Action> = this.actions$
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
                    .buildSaveDataViewRequest(PfDataGridEffects.parsePageViewId(data.action.pageViewId), data.baseEntity.Id, data.action.fields, null))
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
    saveView$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.SAVE_VIEW),
            mergeMap((saveFilterAction: fromPfDataGridActions.SaveView) =>
                of(saveFilterAction).pipe(
                    withLatestFrom(
                        this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, saveFilterAction.pageViewId)),
                        this.store.pipe(select(fromPfDataGridReducer.getFields, saveFilterAction.pageViewId)),
                        (action: fromPfDataGridActions.SaveView, baseEntity, fields) =>
                            ({ action, baseEntity, fields })
                    )
                )
            ),
            switchMap((data) =>
                this.dataViewApiService.updateDataView(PfDataGridEffects.buildSaveDataViewRequest(
                    PfDataGridEffects.parsePageViewId(data.action.pageViewId),
                    data.baseEntity.Id,
                    data.fields,
                    data.action.viewName))
                    .pipe(
                        map((response: any) => {
                            return new fromPfDataGridActions.SaveViewSuccess(data.action.pageViewId, response);
                        }),
                        catchError(error => {
                            const msg = 'We encountered an error while loading your data';
                            return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
                        })
                    )
            )
        );

    @Effect()
    loadSavedViews$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.LOAD_SAVED_VIEWS),
            switchMap((action: fromPfDataGridActions.LoadSavedViews) =>
                this.dataViewApiService.getViewsByUser(PfDataGridEffects.parsePageViewId(action.pageViewId)).pipe(
                    map((response: DataViewConfig[]) => {
                        return new fromPfDataGridActions.LoadSavedViewsSuccess(action.pageViewId, response);
                    }),
                    catchError(error => {
                        const msg = 'We encountered an error while loading your data';
                        return of(new fromPfDataGridActions.HandleApiError(action.pageViewId, msg));
                    })
                )
            )
        );

    @Effect()
    filterChanges$: Observable<Action> = this.actions$
        .pipe(
            ofType(
                fromPfDataGridActions.UPDATE_INBOUND_FILTERS,
                fromPfDataGridActions.UPDATE_FILTER,
                fromPfDataGridActions.CLEAR_FILTER,
                fromPfDataGridActions.CLEAR_ALL_FILTERS,
                fromPfDataGridActions.UPDATE_SORT_DESCRIPTOR),
            mergeMap((action: any) => {
                return [
                    new fromPfDataGridActions.CloseSplitView(action.pageViewId),
                    new fromPfDataGridActions.UpdatePagingOptions(action.pageViewId, fromPfDataGridReducer.DEFAULT_PAGING_OPTIONS)
                ];
            })
        );

    @Effect()
    handleSavedViewClicked$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.HANDLE_SAVED_VIEW_CLICKED),
            mergeMap((action: any) => {
                return [
                    new fromPfDataGridActions.CloseSplitView(action.pageViewId),
                    new fromPfDataGridActions.LoadViewConfig(action.pageViewId, action.viewName)
                ];
            })
        );

    @Effect()
    deleteView$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromPfDataGridActions.DELETE_SAVED_VIEW),
        switchMap((action: any) => {
          return this.dataViewApiService.deleteView(action.pageViewId, action.viewName).pipe(
            mergeMap(() => [
              new fromPfDataGridActions.DeleteSavedViewSuccess(action.pageViewId),
              new fromPfDataGridActions.LoadSavedViews(action.pageViewId),
            ])
          );
        })
      );

    // TODO: We don't have a robust solution to display grids with the same PageViewId on the same page.
    // The PageViewID is the unique identifier in the NGRX state but we might have two different grids with the same PageViewID on the same page
    // To support this we append an ID to the PageViewId. This function stripps out the appened ID when we interact with the backend.
    // Grids which have an ID appended to their PageViewID do not support changing of visible columns and saved filters.
    // To support this properly we most likely need to change the PageViewId be a combination of GUID and an optional Id Filter.
    // However this is a major refactor of the PfDataGrid which we are not ready to undertake at this time.
    static parsePageViewId(pageViewId: string) {
        return pageViewId.split('_')[0];
    }

    static buildSaveDataViewRequest(pageViewId: string, baseEntityId: number,
        fields: ViewField[], name: string): SaveDataViewRequest {
        return <SaveDataViewRequest>{
            PageViewId: pageViewId,
            EntityId: baseEntityId,
            Elements: fields.
                map(e => ({ ElementId: e.DataElementId, FilterOperator: e.FilterOperator,
              FilterValue: e.IsGlobalFilter === false ? e.FilterValue : null, IsSelected: e.IsSelected })),
            Name: name
        };
    }

    static buildDataViewDataRequest(
        baseEntityId: number, fields: ViewField[], filters: DataViewFilter[],
        pagingOptions: PagingOptions, sortDescriptor: SortDescriptor[], withCount: boolean, applyDefaultFilters: boolean) {

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
            WithCount: withCount,
            ApplyDefaultFilters: applyDefaultFilters,
        };
    }

    static mapFieldsToDataViewFilters(fields: ViewField[]) {
        return fields.map(f => ({
            DataElementId: f.DataElementId,
            Operator: f.FilterOperator,
            Value: f.FilterValue
        }));
    }

    static mapFieldsToDataViewFields(fields: ViewField[]): DataViewField[] {
        return fields ? fields
            .filter(f => f.IsSelected)
            .map(f => {
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

    static mapFieldsToFilters(fields: ViewField[]): DataViewFilter[] {
        return fields
            .filter(field => field.FilterValue !== null || !isValueRequired(field))
            .map(field => <DataViewFilter>{
                EntitySourceName: field.EntitySourceName,
                SourceName: field.SourceName,
                Operator: field.FilterOperator,
                Values: [field.FilterValue],
                DataType: field.DataType,
                FilterType: field.CustomFilterStrategy
            });
    }
}
