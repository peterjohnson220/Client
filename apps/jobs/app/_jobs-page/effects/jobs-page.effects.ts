import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyApiService, JobsApiService, PayMarketApiService, PricingApiService } from 'libs/data/payfactors-api';
import { StructuresApiService } from 'libs/data/payfactors-api/structures';
import { UserContext, CompanyDto } from 'libs/models';
import * as fromRootState from 'libs/state/state';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromJobManagementReducer from 'libs/features/job-management/reducers';
import * as fromJobManagementActions from 'libs/features/job-management/actions';

import * as fromJobsPageActions from '../actions';
import * as fromJobsReducer from '../reducers';
import { PageViewIds } from '../constants';

@Injectable()
export class JobsPageEffects {

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private jobsApiService: JobsApiService,
    private pricingApiService: PricingApiService,
    private payMarketApiService: PayMarketApiService,
    private structureApiService: StructuresApiService,
    private store: Store<fromJobsReducer.State>,
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
        mergeMap((company: CompanyDto) =>
          [
            new fromJobsPageActions.LoadCompanySuccess(company.CompanyName),
            new fromJobsPageActions.LoadCompanyPayMarkets(),
            new fromJobsPageActions.LoadStructureGrades()
          ]),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobsPageActions.HandleApiError(msg));
        })
      );
    })
  );

  @Effect()
  addToProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.ADDING_TO_PROJECT),
    switchMap((data: any) => {
      return this.jobsApiService.addToProject(data.payload).pipe(
        mergeMap((projectId: number) => {
          window.location.href = `/marketdata/marketdata.asp?usersession_id=${projectId}`;
          // TODO: When we migrate the Projects page to Client we have to make sure the state is cleared if we return back to the Jobs page
          return [];
        }),
        catchError(error => of(new fromJobsPageActions.AddingToProjectError()))
      );
    })
  );

  @Effect()
  changeJobStatus$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.CHANGING_JOB_STATUS),
    switchMap((data: any) => {
      return this.jobsApiService.changeJobStatus(data.payload).pipe(
        mergeMap(() =>
          [
            new fromJobsPageActions.ChangingJobStatusSuccess(),
            new fromJobsPageActions.ShowJobStatusModal(false),
            new fromPfDataGridActions.ClearSelections(PageViewIds.PricingDetails),
            new fromPfDataGridActions.ClearSelections(PageViewIds.Jobs),
            new fromPfDataGridActions.LoadData(PageViewIds.Jobs),
            new fromPfDataGridActions.CloseSplitView(PageViewIds.Jobs),
          ]),
        catchError(error => of(new fromJobsPageActions.ChangingJobStatusError()))
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

  @Effect()
  loadCompanyPayMarkets$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.LOAD_COMPANY_PAYMARKETS),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action: fromJobsPageActions.LoadCompany, userContext: UserContext) =>
        ({ action, userContext })
    ),
    switchMap(() => {
      return this.payMarketApiService.getAll().pipe(
        map(options => new fromJobsPageActions.LoadCompanyPayMarketsSuccess(options)),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobsPageActions.HandleApiError(msg));
        })
      );
    })
  );

  @Effect()
  loadStructureGrades$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.LOAD_STRUCTURE_GRADES),
    switchMap((action: any) => {
      return this.structureApiService.getGradeNames().pipe(
        map(grades => new fromJobsPageActions.LoadStructureGradesSuccess(grades)),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobsPageActions.HandleApiError(msg));
        })
      );
    })
  );
}

