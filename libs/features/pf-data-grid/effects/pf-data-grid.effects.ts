import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, mergeMap, groupBy, debounceTime, concatMap } from 'rxjs/operators';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import { DataViewConfig, DataViewEntityResponseWithCount, PagingOptions, DataViewType, ExportGridRequest, DataView } from 'libs/models/payfactors-api';
import { DataViewApiService } from 'libs/data/payfactors-api';

import * as fromPfDataGridActions from '../actions';
import * as fromPfDataGridReducer from '../reducers';
import { DataGridToDataViewsHelper } from '../helpers';

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
      groupBy((action: fromPfDataGridActions.LoadViewConfig) => action.pageViewId),
      mergeMap(pageViewIdGroup => pageViewIdGroup.pipe(
        mergeMap((loadViewConfigAction: fromPfDataGridActions.LoadViewConfig) =>
          of(loadViewConfigAction).pipe(
            withLatestFrom(
              this.store.pipe(select(fromPfDataGridReducer.getApplyUserDefaultCompensationFields, loadViewConfigAction.pageViewId)),
              (action: fromPfDataGridActions.LoadViewConfig, applyUserDefaultCompensationFields) =>
                ({ action, applyUserDefaultCompensationFields })
            )
          ),
        ),
        switchMap(
          (data) =>
            this.dataViewApiService.getDataViewConfig(
              PfDataGridEffects.parsePageViewId(data.action.pageViewId),
              data.action.name,
              data.applyUserDefaultCompensationFields
            ).pipe(
              mergeMap((viewConfig: DataViewConfig) => {
                return [
                  new fromPfDataGridActions.LoadViewConfigSuccess(data.action.pageViewId, viewConfig),
                  new fromPfDataGridActions.LoadData(data.action.pageViewId)
                ];
              }),
              catchError(error => {
                const msg = 'We encountered an error while loading the data fields.';
                return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
              })
            )
        )))
    );

  @Effect()
  loadData$: Observable<Action> = this.actions$
    .pipe(
      ofType(
        fromPfDataGridActions.LOAD_DATA,
        fromPfDataGridActions.UPDATE_PAGING_OPTIONS,
        fromPfDataGridActions.LOAD_MORE_DATA,
        fromPfDataGridActions.RELOAD_DATA
      ),
      groupBy((action: fromPfDataGridActions.LoadData) => action.pageViewId),
      mergeMap(pageViewIdGroup => pageViewIdGroup
        .pipe(
          debounceTime(10),
          mergeMap((loadDataAction: fromPfDataGridActions.LoadData) =>
            of(loadDataAction).pipe(
              withLatestFrom(
                this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, loadDataAction.pageViewId)),
                this.store.pipe(select(fromPfDataGridReducer.getFields, loadDataAction.pageViewId)),
                this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, loadDataAction.pageViewId)),
                this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, loadDataAction.pageViewId)),
                this.store.pipe(select(fromPfDataGridReducer.getApplyDefaultFilters, loadDataAction.pageViewId)),
                this.store.pipe(select(fromPfDataGridReducer.getUseReportingDB, loadDataAction.pageViewId)),
                this.store.pipe(select(fromPfDataGridReducer.getLinkGroups, loadDataAction.pageViewId)),
                (action: fromPfDataGridActions.ReloadData,
                  baseEntity,
                  fields,
                  pagingOptions,
                  sortDescriptor,
                  applyDefaultFilters,
                  useReportingDB,
                  linkGroups) =>
                  ({ action, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters, useReportingDB, linkGroups })
              )
            ),
          ),
          switchMap((data) => {
            if (data.fields) {
              const withCount = !data.action.type.includes('Load More Data');
              const pagingOptions: PagingOptions = {
                From: data.pagingOptions.From,
                Count: data.pagingOptions.Count
              };

              if (data.action.type.includes('Reload Data')) {
                pagingOptions.From = 0;
                pagingOptions.Count = data.action.count;
              }

              return this.dataViewApiService
                .getDataWithCount(DataGridToDataViewsHelper.buildDataViewDataRequest(
                  data.baseEntity.Id,
                  data.fields,
                  DataGridToDataViewsHelper.mapFieldsToFiltersUseValuesProperty(data.fields),
                  pagingOptions,
                  data.sortDescriptor,
                  withCount,
                  data.applyDefaultFilters,
                  data.useReportingDB,
                  data.linkGroups))
                .pipe(
                  map((response: DataViewEntityResponseWithCount) => {
                    if (data.pagingOptions.From > 0 && !withCount) {
                      return new fromPfDataGridActions.LoadMoreDataSuccess(data.action.pageViewId, response);
                    } else if (data.action.type.includes('Reload Data')) {
                      return new fromPfDataGridActions.ReloadDataSuccess(data.action.pageViewId, response);
                    } else {
                      return new fromPfDataGridActions.LoadDataSuccess(data.action.pageViewId, response);
                    }
                  }),
                  catchError(error => {
                    const msg = 'We encountered an error while loading your data';
                    return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
                  })
                );
            } else {
              return of(new fromPfDataGridActions.DoNothing(data.action.pageViewId));
            }
          })
        )
      )
    );

  @Effect()
  updateFields$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPfDataGridActions.UPDATE_FIELDS),
      groupBy((action: fromPfDataGridActions.UpdateFields) => action.pageViewId),
      mergeMap(pageViewIdGroup => pageViewIdGroup.pipe(
        mergeMap((updateFieldsAction: fromPfDataGridActions.UpdateFields) =>
          of(updateFieldsAction).pipe(
            withLatestFrom(
              this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, updateFieldsAction.pageViewId)),
              this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, updateFieldsAction.pageViewId)),
              this.store.pipe(select(fromPfDataGridReducer.getSaveSort, updateFieldsAction.pageViewId)),
              this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
              (action: fromPfDataGridActions.UpdateFields, baseEntity, sortDescriptor, saveSort, gridConfig) =>
                ({ action, baseEntity, sortDescriptor, saveSort, gridConfig })
            )
          ),
        ),
        switchMap((data) =>
          this.dataViewApiService.updateDataView(DataGridToDataViewsHelper
            .buildDataView(
              PfDataGridEffects.parsePageViewId(data.action.pageViewId),
              data.baseEntity.Id,
              data.action.fields,
              data.saveSort ? data.sortDescriptor : null,
              null,
              DataViewType.userDefault,
              data.gridConfig))
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
      ))
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
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, saveFilterAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSaveSort, saveFilterAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
            (action: fromPfDataGridActions.SaveView, baseEntity, fields, sortDescriptor, saveSort, gridConfig) =>
              ({ action, baseEntity, fields, sortDescriptor, saveSort, gridConfig })
          )
        )
      ),
      switchMap((data) =>
        this.dataViewApiService.updateDataView(DataGridToDataViewsHelper.buildDataView(
          PfDataGridEffects.parsePageViewId(data.action.pageViewId),
          data.baseEntity.Id,
          data.fields,
          data.saveSort ? data.sortDescriptor : null,
          data.action.viewName,
          data.action.viewType,
          data.gridConfig))
          .pipe(
            map((response: any) => {
              return new fromPfDataGridActions.SaveViewSuccess(data.action.pageViewId, response, data.action.viewType);
            }),
            catchError(error => {
              const msg = 'We encountered an error while loading your data';
              return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
            })
          )
      )
    );

  @Effect()
  reorderColumns: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPfDataGridActions.REORDER_COLUMNS),
      debounceTime(200),
      concatMap((reorderColumnsAction: fromPfDataGridActions.ReorderColumns) =>
        of(reorderColumnsAction).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, reorderColumnsAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFields, reorderColumnsAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, reorderColumnsAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSaveSort, reorderColumnsAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
            (action: fromPfDataGridActions.ReorderColumns, baseEntity, fields, sortDescriptor, saveSort, gridConfig) =>
              ({ action, baseEntity, fields, sortDescriptor, saveSort, gridConfig })
          )
        )
      ),
      switchMap((data) =>
        this.dataViewApiService.updateDataView(DataGridToDataViewsHelper.buildDataView(
          PfDataGridEffects.parsePageViewId(data.action.pageViewId),
          data.baseEntity.Id,
          data.fields,
          data.saveSort ? data.sortDescriptor : null,
          null,
          DataViewType.userDefault,
          data.gridConfig))
          .pipe(
            map((response: any) => {
              return new fromPfDataGridActions.ReorderColumnsSuccess();
            }),
            catchError(error => {
              const msg = 'We encountered an error while reordering your column';
              return of(new fromPfDataGridActions.HandleApiError(data.action.pageViewId, msg));
            })
          )
      )
    );

  @Effect()
  loadSavedViews$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPfDataGridActions.LOAD_SAVED_VIEWS),
      groupBy((action: fromPfDataGridActions.LoadSavedViews) => action.pageViewId),
      mergeMap(pageViewIdGroup => pageViewIdGroup.pipe(
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
      ))
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
      mergeMap((filterChangsAction: any) =>
        of(filterChangsAction).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, filterChangsAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSaveSort, filterChangsAction.pageViewId)),
            (action: any, pagingOptions: PagingOptions) => ({ action, pagingOptions })
          )
        )
      ),
      mergeMap((data) => {
        return [
          new fromPfDataGridActions.CloseSplitView(data.action.pageViewId),
          new fromPfDataGridActions.UpdatePagingOptions(
            data.action.pageViewId,
            data.pagingOptions ? { From: 0, Count: data.pagingOptions.Count } : fromPfDataGridReducer.DEFAULT_PAGING_OPTIONS
          ),
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

  @Effect()
  exportGrid$ = this.actions$
    .pipe(
      ofType(fromPfDataGridActions.EXPORT_GRID),
      mergeMap((exportGridAction: fromPfDataGridActions.ExportGrid) =>
        of(exportGridAction).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, exportGridAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFields, exportGridAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSelectedKeys, exportGridAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, exportGridAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSelectionField, exportGridAction.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFieldsExcludedForExport, exportGridAction.pageViewId)),
            (action: fromPfDataGridActions.ExportGrid, baseEntity, fields, selectedKeys, sortDescriptor, selectionField, fieldsExcludedFromExport) =>
              ({ action, baseEntity, fields, selectedKeys, sortDescriptor, selectionField, fieldsExcludedFromExport })
          )
        )
      ),
      switchMap((data) => {
        const selectableFields = data.fields.filter(f =>
          f.IsSelected && (!data.fieldsExcludedFromExport || data.fieldsExcludedFromExport.indexOf(f.SourceName) === -1));
        const selectedFields = DataGridToDataViewsHelper.mapFieldsToDataViewFields(selectableFields, data.sortDescriptor);
        const filters = DataGridToDataViewsHelper.getFiltersForExportView(data.fields, data.selectionField, data.selectedKeys);
        const dataView: DataView = {
          EntityId: data.baseEntity.Id,
          PageViewId: data.action.pageViewId,
          Elements: selectedFields,
          Filters: filters
        };
        const request: ExportGridRequest = {
          DataView: dataView,
          Source: data.action.source,
          CustomExportType: data.action.customExportType
        };
        return this.dataViewApiService.exportGrid(request)
          .pipe(
            map((response) => new fromPfDataGridActions.ExportGridSuccess(data.action.pageViewId, response)),
            catchError(() => of(new fromPfDataGridActions.ExportGridError()))
          );
      })
    );

  @Effect()
  getExportingStatus$ = this.actions$
    .pipe(
      ofType(fromPfDataGridActions.GET_EXPORTING_STATUS),
      switchMap((action: fromPfDataGridActions.GetExportingStatus) => {
        return this.dataViewApiService.getExportingDataView(action.dataViewId)
          .pipe(
            map((response) => new fromPfDataGridActions.GetExportingStatusSuccess(action.pageViewId, response)),
            catchError(() => of(new fromPfDataGridActions.GetExportingStatusError(action.pageViewId)))
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
}
