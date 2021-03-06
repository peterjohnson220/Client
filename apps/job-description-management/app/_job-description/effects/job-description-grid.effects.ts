import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { UserProfileApiService } from 'libs/data/payfactors-api/user';
import { JobDescriptionApiService, JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm';
import { CompanyJobViewListItemsResponse } from 'libs/models/payfactors-api/job-description/response';
import { ListAreaColumnResponse } from 'libs/models/payfactors-api/user-profile/response';
import { PayfactorsApiModelMapper } from 'libs/features/jobs/job-description-management/helpers';
import { MappingHelper } from 'libs/core/helpers';
import { SaveListAreaColumnsRequest } from 'libs/models/payfactors-api/user-profile';

import * as fromJobDescriptionGridActions from '../actions/job-description-grid.actions';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import * as fromJobDescriptionInboxActions from '../actions/job-description-inbox.actions';
import * as fromJobDescriptionGridReducer from '../reducers';
import { NotificationLevel, NotificationSource } from 'libs/features/infrastructure/app-notifications';

@Injectable()
export class JobDescriptionGridEffects {
  @Effect()
  getListAreaColumns$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionGridActions.LOAD_LIST_AREA_COLUMNS),
      switchMap((action: fromJobDescriptionGridActions.LoadListAreaColumns) =>
        this.userProfileApiService.getListAreaColumns(action.payload).pipe(
          map((response: ListAreaColumnResponse[]) => {
            const listAreaColumnList =  MappingHelper.mapListAreaColumnResponseListToListAreaColumnList(response);
            return new fromJobDescriptionGridActions.LoadListAreaColumnsSuccess(listAreaColumnList);
          }),
          catchError(response => of(new fromJobDescriptionGridActions.LoadListAreaColumnsError()))
        )
      ));

  @Effect()
  loadJobDescriptionGrid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionGridActions.LOAD_JOB_DESCRIPTION_GRID),
      switchMap((action: fromJobDescriptionGridActions.LoadJobDescriptionGrid) => {
        this.store.dispatch(new fromJobDescriptionGridActions.UpdateGridState(JSON.parse(action.payload.ListState)));

        return this.jobDescriptionApiService.getCompanyJobViewListItems(action.payload).pipe(
          map((response: CompanyJobViewListItemsResponse) => {
            const gridDataResult = PayfactorsApiModelMapper.mapCompanyJobViewListItemsResponseToGridDataResult(response);
            return new fromJobDescriptionGridActions.LoadJobDescriptionGridSuccess(gridDataResult);
          }),
          catchError(response => {
            if (response.status === 404) {
               this.router.navigate(['404']);
            }
            return of(new fromJobDescriptionGridActions.SaveListAreaColumnsError());
          })
        );
      }
      ));

    @Effect()
    saveListAreaColumns$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromJobDescriptionGridActions.SAVE_LIST_AREA_COLUMNS),
        switchMap((action: fromJobDescriptionGridActions.SaveListAreaColumns) => {
            const request: SaveListAreaColumnsRequest = {
              Columns: MappingHelper.mapListAreaColumnListToListAreaColumnRequestList(action.payload)
            };

            return this.userProfileApiService.saveListAreaColumns(request).pipe(
              map(() => {
                return new fromJobDescriptionGridActions.SaveListAreaColumnsSuccess({ ListAreaColumns: action.payload });
              }),
              catchError(response => of(new fromJobDescriptionGridActions.SaveListAreaColumnsError()))
            );
          }
        ));

    @Effect()
    getPublicJdmColumns$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionGridActions.LOAD_PUBLIC_JDM_COLUMNS),
      switchMap((action: fromJobDescriptionGridActions.LoadPublicJdmColumns) =>
        this.jobDescriptionManagementApiService.getPublicJdmColumns(action.payload).pipe(
          map((response: ListAreaColumnResponse[]) => {
            const listAreaColumnList =  MappingHelper.mapListAreaColumnResponseListToListAreaColumnList(response);
            return new fromJobDescriptionGridActions.LoadPublicJdmColumnsSuccess(listAreaColumnList);
          }),
          catchError(response => of(new fromJobDescriptionGridActions.LoadPublicJdmColumnsError()))
        )
      ));

    @Effect()
    updatePublicView$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromJobDescriptionGridActions.UPDATE_PUBLIC_VIEW),
        switchMap((action: fromJobDescriptionGridActions.UpdatePublicView) => {
            const clonedPayload = cloneDeep(action.payload);
            clonedPayload.PublicView = !clonedPayload.PublicView;

            return this.jobDescriptionApiService.updatePublicView(clonedPayload.CompanyId, clonedPayload.JobDescriptionId, clonedPayload.PublicView).pipe(
              map(() => {
                return new fromJobDescriptionGridActions.UpdatePublicViewSuccess(clonedPayload);
              }),
              catchError(response => of(new fromJobDescriptionGridActions.UpdatePublicViewError()))
            );
          }
        ));

  @Effect()
  addNotification$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromAppNotificationsActions.AddNotification>(fromAppNotificationsActions.ADD_NOTIFICATION),
      concatMap((action) => {
        const actions = [];
        if (action.payload.From === NotificationSource.JDMRouting
          && action.payload.Level === NotificationLevel.Success)  {
            if (action.payload.Payload?.Status === 'Started') {
              actions.push(new fromJobDescriptionGridActions.AddRoutingJobs([action.payload.Payload?.JobDescriptionId]));
            } else if (action.payload.Payload?.Status === 'Complete') {
              actions.push( new fromJobDescriptionInboxActions.GetUnreadInboxCount());
              actions.push(new fromJobDescriptionGridActions.RemoveRoutingJob(action.payload.Payload?.JobDescriptionId));
            }
        }
        return actions;
      })
  );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private userProfileApiService: UserProfileApiService,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private store: Store<fromJobDescriptionGridReducer.State>,
    private router: Router
  ) {}
}
