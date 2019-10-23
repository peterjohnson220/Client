import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';

import { DataViewApiService, UserApiService } from 'libs/data/payfactors-api';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromDataViewActions from '../actions/data-view.actions';
import * as fromDataViewGridActions from '../actions/data-view-grid.actions';
import * as fromFiltersActions from '../actions/filters.actions';
import * as fromFieldsActions from '../actions/fields.actions';
import * as fromDataViewReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { Entity } from '../models';

@Injectable()
export class DataViewEffects {

  @Effect()
  getBaseEntities$ = this.action$
  .pipe(
    ofType(fromDataViewActions.GET_BASE_ENTITIES),
    switchMap(() => {
      return this.dataViewApiService.getBaseEntities()
      .pipe(
        map((response) => {
          const baseEntities: Entity[] = PayfactorsApiModelMapper.mapDataViewEntityResponsesToEntities(response);
          return new fromDataViewActions.GetBaseEntitiesSuccess(baseEntities);
        }),
        catchError(() => of(new fromDataViewActions.GetBaseEntitiesError()))
      );
    })
  );

  @Effect()
  saveUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.SAVE_USER_REPORT),
      switchMap((action: fromDataViewActions.SaveUserReport) => {
        return this.dataViewApiService.saveUserDataView({
          BaseEntityId: action.payload.Entity.Id,
          Name: action.payload.Name,
          Summary: action.payload.Summary
        })
          .pipe(
            map((response) => {
              return new fromDataViewActions.SaveUserReportSuccess({ dataViewId: response });
            }),
            catchError((response) => {
              return of(response.status === 409 ?
                new fromDataViewActions.SaveUserReportConflict()
                : new fromDataViewActions.SaveUserReportError());
            })
          );
      })
    );

  @Effect()
  editUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.EDIT_USER_REPORT),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.EditUserReport, userDataView) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        return this.dataViewApiService.editUserDataView({
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          Name: data.action.payload.Name,
          Summary: data.action.payload.Summary
        })
          .pipe(
            map(() => {
              return new fromDataViewActions.EditUserReportSuccess(data.action.payload);
            }),
            catchError((response) => {
              return of(response.status === 409 ?
                new fromDataViewActions.EditUserReportConflict()
                : new fromDataViewActions.EditUserReportError());
            })
          );
      })
    );

  @Effect()
  duplicateUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.DUPLICATE_USER_REPORT),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        this.store.pipe(select(fromDataViewReducer.getSortDescriptor)),
        (action: fromDataViewActions.DuplicateUserReport, userDataView, sortDescriptor) =>
          ({ action, userDataView, sortDescriptor })
      ),
      switchMap((data) => {
        return this.dataViewApiService.duplicateUserDataView({
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          Name: data.action.payload.Name,
          Summary: data.action.payload.Summary,
          SortField: !!data.sortDescriptor ? data.sortDescriptor.field : '',
          SortDir: !!data.sortDescriptor ? data.sortDescriptor.dir : ''
        })
          .pipe(
            map((response) => {
              return new fromDataViewActions.DuplicateUserReportSuccess({ dataViewId: response });
            }),
            catchError((response) => {
              return of(response.status === 409 ?
                new fromDataViewActions.DuplicateUserReportConflict()
                : new fromDataViewActions.DuplicateUserReportError());
            })
          );
      })
    );

  @Effect({dispatch: false})
  saveUserReportSuccess$ = this.action$
    .pipe(
      ofType(fromDataViewActions.SAVE_USER_REPORT_SUCCESS),
      tap((action: fromDataViewActions.SaveUserReportSuccess) => {
        this.router.navigate(['custom-report', action.payload.dataViewId]);
      })
    );

  @Effect({dispatch: false})
  duplicateUserReportSuccess$ = this.action$
    .pipe(
      ofType(fromDataViewActions.DUPLICATE_USER_REPORT_SUCCESS),
      tap((action: fromDataViewActions.DuplicateUserReportSuccess) => {
        this.router.navigate(['custom-report', action.payload.dataViewId]);
      })
    );

  @Effect()
  getUserDataView$ = this.action$
    .pipe(
      ofType(fromDataViewActions.GET_USER_DATA_VIEW),
      switchMap((action: fromDataViewActions.GetUserDataView) => {
        return this.dataViewApiService.getUserDataView(action.payload.dataViewId)
          .pipe(
            mergeMap((response) => {
              const userDataView = PayfactorsApiModelMapper.mapUserDataViewResponseToUserDataView(response);
              const selectedFields = PayfactorsApiModelMapper.mapDataViewFieldsToFields(response.Fields);
              const filters = PayfactorsApiModelMapper.mapDataViewFiltersToFilters(response.Filters, response.Fields);
              const sortDescriptor: SortDescriptor = {
                field: userDataView.SortField,
                dir: userDataView.SortDir
              };
              return [
                new fromDataViewActions.GetUserDataViewSuccess(userDataView),
                new fromDataViewGridActions.SetSortDescriptor(sortDescriptor),
                new fromFieldsActions.SetSelectedFields(selectedFields),
                new fromFiltersActions.SetFilters(filters),
                new fromDataViewGridActions.GetData()
              ];
            }),
            catchError(error => of (new fromDataViewActions.GetUserDataViewError(error)))
          );
      })
    );

  @Effect()
  deleteUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.DELETE_USER_REPORT),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.DeleteUserReport, userDataView) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        return this.dataViewApiService.deleteUserDateView({
          UserDataViewId: data.userDataView.obj.UserDataViewId
        })
          .pipe(
            map((response) => {
              return new fromDataViewActions.DeleteUserReportSuccess();
            })
          );
      })
    );

  @Effect({dispatch: false})
  deleteUserReportSuccess$ = this.action$
    .pipe(
      ofType(fromDataViewActions.DELETE_USER_REPORT_SUCCESS),
      tap(() =>
        this.router.navigate(['']))
    );

  @Effect()
  exportUserDataView$ = this.action$
    .pipe(
      ofType(fromDataViewActions.EXPORT_USER_REPORT),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.ExportUserReport, userDataView) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        return this.dataViewApiService.exportUserDataView(data.userDataView.obj.UserDataViewId)
          .pipe(
            map((response) => new fromDataViewActions.ExportUserReportSuccess(response)),
            catchError(() => of(new fromDataViewActions.ExportUserReportError()))
          );
      })
    );

  @Effect()
  getExportingUserReport$ = this.action$
    .pipe(
      ofType(fromDataViewActions.GET_EXPORTING_USER_REPORT),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.GetExportingUserReport) =>
          ({ action })
      ),
      switchMap((data) => {
        return this.dataViewApiService.getExportingDataView(data.action.payload.dataViewId)
          .pipe(
            map((response) => new fromDataViewActions.GetExportingUserReportSuccess(response)),
            catchError(() => of(new fromDataViewActions.GetExportingUserReportError()))
          );
      })
    );

  @Effect()
  getShareableUsers$ = this.action$
    .pipe(
      ofType(fromDataViewActions.GET_SHAREABLE_USERS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action: fromDataViewActions.GetShareableUsers, userContext: UserContext ) =>
          ({ action, userContext })
      ),
      switchMap((data) => {
        return this.userApiService.getShareableUsersByTile(data.userContext.UserId, data.userContext.CompanyId, 'Data Insights')
          .pipe(
            map((response) => new fromDataViewActions.GetShareableUsersSuccess(PayfactorsApiModelMapper.mapShareUserResponseToUser(response))),
            catchError(() => of(new fromDataViewActions.GetShareableUsersError()))
          );
      })
    );

  @Effect()
  getShareableUsersSuccess$ = this.action$
    .pipe(
      ofType(fromDataViewActions.GET_SHAREABLE_USERS_SUCCESS),
      map(() =>
        new fromDataViewActions.GetSharePermissions()
      )
    );

  @Effect()
  saveSharePermissions$ = this.action$
    .pipe(
      ofType(fromDataViewActions.SAVE_SHARE_PERMISSIONS),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.SaveSharePermissions, userDataView ) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        return this.dataViewApiService.shareDataView({
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          UserPermissions: data.action.payload.map(x => {
            return {
              UserId: x.UserId,
              CanEdit: x.CanEdit
            };
          })
        })
          .pipe(
            map(() => new fromDataViewActions.SaveSharePermissionsSuccess(data.action.payload)),
            catchError(() => of(new fromDataViewActions.SaveSharePermissionsError()))
          );
      })
    );

  @Effect()
  getSharedUserPermissions$ = this.action$
    .pipe(
      ofType(fromDataViewActions.GET_SHARE_PERMISSIONS),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.GetSharePermissions, userDataView ) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        return this.dataViewApiService.getSharePermissions(data.userDataView.obj.UserDataViewId)
          .pipe(
            map((response) => new fromDataViewActions.GetSharePermissionsSuccess(response)),
            catchError(() => of(new fromDataViewActions.GetSharePermissionsError()))
          );
      })
    );

  @Effect()
  removeSharedUserPermission$ = this.action$
    .pipe(
      ofType(fromDataViewActions.REMOVE_SHARE_PERMISSION),
      withLatestFrom(
        this.store.pipe(select(fromDataViewReducer.getUserDataViewAsync)),
        (action: fromDataViewActions.RemoveSharePermission, userDataView ) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        return this.dataViewApiService.removeSharePermission({
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          UserIdToRemove: data.action.payload.UserId
        })
          .pipe(
            map(() => new fromDataViewActions.RemoveSharePermissionSuccess(data.action.payload)),
            catchError(() => of(new fromDataViewActions.RemoveSharePermissionError()))
          );
      })
    );

  constructor(
    private action$: Actions,
    private store: Store<fromDataViewReducer.State>,
    private dataViewApiService: DataViewApiService,
    private userApiService: UserApiService,
    private router: Router
  ) {}
}
