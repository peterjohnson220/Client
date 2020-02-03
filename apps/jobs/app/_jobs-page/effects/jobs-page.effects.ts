import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyApiService, JobsApiService, PricingApiService } from 'libs/data/payfactors-api';
import { UserContext, CompanyDto } from 'libs/models';
import * as fromRootState from 'libs/state/state';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromJobManagementReducer from 'libs/features/job-management/reducers';
import * as fromJobManagementActions from 'libs/features/job-management/actions';

import * as fromJobsPageActions from '../actions';
import * as fromJobsReducer from '../reducers';

@Injectable()
export class JobsPageEffects {

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private jobsApiService: JobsApiService,
    private pricingApiService: PricingApiService,
    private store: Store<fromJobsReducer.State>,
    private jobManagementStore: Store<fromJobManagementReducer.State>
  ) { }

  @Effect()
  loadCompany$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.LOAD_COMPANY),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action: fromJobsPageActions.LoadCompany, userContext: UserContext) =>
        ({ action, userContext })
    ),
    switchMap((data) => {
      return this.companyApiService.get(data.userContext.CompanyId).pipe(
        map((company: CompanyDto) => new fromJobsPageActions.LoadCompanySuccess(company.CompanyName)),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobsPageActions.HandleApiError(msg));
        })
      );
    })
  );

  @Effect()
  addToProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.ADD_TO_PROJECT),
    switchMap((data: any) => {
      return this.jobsApiService.addToProject(data.payload).pipe(
        map((projectId: number) => {
          window.location.href = `/marketdata/marketdata.asp?usersession_id=${projectId}`;
          return new fromJobsPageActions.AddToProjectSuccess();
        }),
        catchError(error => {
          const msg = 'We encountered an error while creating a project';
          return of(new fromJobsPageActions.HandleApiError(msg));
        })
      );
    })
  );

  @Effect()
  deletePricing$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.DELETE_PRICING_FROM_GRID),
    switchMap((action: any) => {
      return this.pricingApiService.deletePricing(action.payload).pipe(
        mergeMap(() => [
          new fromJobsPageActions.DeletePricingSuccess(),
          new fromPfDataGridActions.LoadData(action.pageViewId)
        ])
      );
    })
  );

  @Effect()
  saveCompanyJobSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobManagementActions.SAVE_COMPANY_JOB_SUCCESS),
    withLatestFrom(
      this.store.pipe(select(fromJobsReducer.getJobsPageId)),
      (action: fromJobManagementActions.SaveCompanyJobSuccess, jobsPageId) =>
        ({ action, jobsPageId })
    ),
    switchMap(data => [
      new fromPfDataGridActions.LoadData(data.jobsPageId),
      new fromPfDataGridActions.CloseSplitView(data.jobsPageId)
    ])
  );
}

