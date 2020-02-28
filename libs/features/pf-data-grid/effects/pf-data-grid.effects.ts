import { Inject, Injectable } from '@angular/core';

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
    PagingOptions,
    DataViewFieldType,
    DataViewType
} from 'libs/models/payfactors-api';
import { DataViewApiService } from 'libs/data/payfactors-api';
import { IDataViewService } from 'libs/models/data-view';

import * as fromPfDataGridActions from '../actions';
import * as fromPfDataGridReducer from '../reducers';
import { isValueRequired } from '../components';

@Injectable()
export class PfDataGridEffects {
    constructor(private actions$: Actions,
        private dataViewApiService: DataViewApiService,
        private store: Store<fromPfDataGridReducer.State>,
        @Inject('DataViewService') private dataViewService: IDataViewService
    ) { }

    @Effect()
    loadViewConfig$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromPfDataGridActions.LOAD_VIEW_CONFIG),
            switchMap(
                (action: fromPfDataGridActions.LoadViewConfig) =>
                    this.dataViewService.getDataViewConfig(PfDataGridEffects.parsePageViewId(action.pageViewId), action.name).pipe(
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
                        this.store.pipe(select(fromPfDataGridReducer.getInboundFilterSourceNameWhiteList, loadDataAction.pageViewId)),
                        (action: fromPfDataGridActions.LoadData, baseEntity, fields, pagingOptions,
                         sortDescriptor, applyDefaultFilters, inboundFilterSourceNameWhiteList) =>
                            ({ action, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters, inboundFilterSourceNameWhiteList })
                    )
                ),
            ),
            switchMap((data) => {
                if (data.fields) {
                    return this.dataViewService
                        .getDataWithCount(PfDataGridEffects.buildDataViewDataRequest(
                            data.baseEntity ? data.baseEntity.Id : null,
                            data.fields,
                            PfDataGridEffects.mapFieldsToFilters(data.fields, data.inboundFilterSourceNameWhiteList),
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
                    .buildSaveDataViewRequest(
                        PfDataGridEffects.parsePageViewId(data.action.pageViewId),
                        data.baseEntity.Id,
                        data.action.fields,
                        null,
                        DataViewType.userDefault))
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
                this.dataViewService.updateDataView(PfDataGridEffects.buildSaveDataViewRequest(
                    PfDataGridEffects.parsePageViewId(data.action.pageViewId),
                    data.baseEntity.Id,
                    data.fields,
                    data.action.viewName,
                    DataViewType.savedFilter))
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
                this.dataViewService.getViewsByUser(PfDataGridEffects.parsePageViewId(action.pageViewId)).pipe(
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
                fromPfDataGridActions.CLEAR_ALL_NON_GLOBAL_FILTERS,
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
        fields: ViewField[], name: string, type: DataViewType): SaveDataViewRequest {
        return <SaveDataViewRequest>{
            PageViewId: pageViewId,
            EntityId: baseEntityId,
            Name: name,
            Type: type,
            Elements: fields
                .filter(f => f.IsSelected)
                .map(e => ({
                    DisplayName: e.DisplayName,
                    DataElementId: e.DataElementId
                })),
                // TODO: Change the way we save filters. This assumes we never save GlobalFilters and we never save filters for Named Views
            Filters: fields
                .filter(f => !f.IsGlobalFilter && f.FilterValue !== null && name !== null)
                .map(e => ({
                    DataElementId: e.DataElementId,
                    Operator: e.FilterOperator,
                    Value: e.FilterValue
                })),

        };
    }

    static buildDataViewDataRequest(
        baseEntityId: number, fields: ViewField[], filters: DataViewFilter[],
        pagingOptions: PagingOptions, sortDescriptor: SortDescriptor[], withCount: boolean, applyDefaultFilters: boolean) {

        return {
            BaseEntityId: baseEntityId,
            Fields: PfDataGridEffects.mapFieldsToDataViewFields(fields, sortDescriptor),
            Filters: filters,
            PagingOptions: pagingOptions,
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

    static mapFieldsToDataViewFields(fields: ViewField[], sortDescriptor: SortDescriptor[]): DataViewField[] {
        return fields ? fields
            .filter(f => f.IsSelected)
            .map(f => {
                const sortInfo = this.getSortInformation(f, sortDescriptor);
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
                    Order: f.Order,
                    FieldType: DataViewFieldType.DataElement,
                    SortOrder: !!sortInfo ? sortInfo.SortOrder : null,
                    SortDirection: !!sortInfo ? sortInfo.SortDirection : null
                };
            })
            : [];
    }

    private static getSortInformation(field: ViewField, sortDescriptor: SortDescriptor[]) {
      if (!!sortDescriptor && sortDescriptor.length > 0) {
        const sortInfo = sortDescriptor.find(x => x.field === `${field.EntitySourceName}_${field.SourceName}`);
        if (!!sortInfo) {
          return {
            SortDirection: sortInfo.dir,
            SortOrder: sortDescriptor.indexOf(sortInfo)
          };
        } else {
          return null;
        }
      }
      return null;
    }

    static mapFieldsToFilters(fields: ViewField[], sourceNameWhiteList: string[]): DataViewFilter[] {
        return fields
            .filter(field => (field.FilterValue !== null || !isValueRequired(field)) &&
              ((!sourceNameWhiteList || !sourceNameWhiteList.length) || sourceNameWhiteList.indexOf(field.SourceName) > -1))
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
