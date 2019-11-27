import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyApiService, JobsApiService } from 'libs/data/payfactors-api';

import * as fromJobsPageActions from '../actions';
import * as fromJobsReducer from '../reducers';
import { UserContext, CompanyDto } from 'libs/models';

import * as fromRootState from 'libs/state/state';


@Injectable()
export class JobsPageEffects {

    constructor(
        private actions$: Actions,
        private companyApiService: CompanyApiService,
        private jobsApiService: JobsApiService,
        private store: Store<fromJobsReducer.State>
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
    addJobsToProject: Observable<Action> = this.actions$.pipe(
      ofType(fromJobsPageActions.ADD_JOBS_TO_PROJECT),
      switchMap((data: any) => {
        return this.jobsApiService.addJobsToProject(data.payload).pipe(
          map((projectId: number) => {
            window.location.href = `/marketdata/marketdata.asp?usersession_id=${projectId}`;
            return null;
          }),
          catchError(error => {
            const msg = 'We encountered an error while creating a project';
            return of(new fromJobsPageActions.HandleApiError(msg));
          })
        );
      })
    );


}

