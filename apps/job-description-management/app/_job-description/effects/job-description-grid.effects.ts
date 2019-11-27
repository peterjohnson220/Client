import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';

import { UserProfileApiService } from 'libs/data/payfactors-api/user';
import { JobDescriptionApiService, JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm';
import { CompanyJobViewListItemsResponse } from 'libs/models/payfactors-api/job-description/response';
import { ListAreaColumnResponse } from 'libs/models/payfactors-api/user-profile/response';

import * as fromJobDescriptionGridActions from '../actions/job-description-grid.actions';
import * as fromJobDescriptionGridReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../../shared/helpers';
import { MappingHelper } from 'libs/core/helpers';


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
          const newRequest = cloneDeep(action.payload);
          newRequest.Columns = MappingHelper.mapListAreaColumnListToListAreaColumnRequestList(newRequest.Columns);

          return this.userProfileApiService.saveListAreaColumns(newRequest).pipe(
            map(() => {
              return new fromJobDescriptionGridActions.SaveListAreaColumnsSuccess({ ListAreaColumns: action.payload.Columns });
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

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private userProfileApiService: UserProfileApiService,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private store: Store<fromJobDescriptionGridReducer.State>,
    private router: Router
  ) {}
}
