import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

import { ExchangeApiService, ExchangeCompanyApiService, CompanyJobApiService } from 'libs/data/payfactors-api';
import { ExchangeJobSearch, CompanyJobSummary } from 'libs/models';

import * as fromAssociateAction from '../actions/associate-company-jobs.actions';
import { WindowCommunicationService } from 'libs/core/services';

@Injectable()
export class AssociateCompanyJobEffects {

    @Effect()
    loadCompanyJob$: Observable<Action> = this.actions$.pipe(
        ofType(fromAssociateAction.LOAD_COMPANY_JOB),
        map((action: fromAssociateAction.LoadCompanyJob) => action.payload),
        switchMap(payload =>
            this.companyJobApiService.getCompanyJobWithJDMDescription(payload).pipe(
                map((companyjob: CompanyJobSummary) => {
                    return new fromAssociateAction.LoadCompanyJobSuccess(companyjob);
                })
                , catchError(() => of(new fromAssociateAction.LoadCompanyJobError())))
        )
    );

    @Effect()
    loadCompanyJobsToMapToByQuery$: Observable<Action> = this.actions$.pipe(
        ofType(fromAssociateAction.LOAD_EXCHANGE_JOBS),
        map((action: fromAssociateAction.LoadExchangeJobs) => action.payload),
        switchMap(payload =>
            this.exchangeApiService.getExchangeJobSearch(payload.exchangeId, payload.titleQuery, payload.exchangeDescriptionQuery).pipe(
                map((companyJobsToMapTo: ExchangeJobSearch[]) => {
                    return new fromAssociateAction.LoadExchangeJobsSuccess(companyJobsToMapTo);
                })
                , catchError(() => of(new fromAssociateAction.LoadExchangeJobsError())))
        )
    );

    @Effect()
    applyMapping$ = this.actions$.pipe(
        ofType(fromAssociateAction.MAP_EXCHANGE_JOB),
        map((action: fromAssociateAction.MapExchangeJob) => action.payload),
        switchMap(payload =>
            this.exchangeCompanyApiService.upsertExchangeJobMap(payload).pipe(
                map(() => {
                    this.windowCommunicationService.postMessage(fromAssociateAction.MAP_EXCHANGE_JOB_SUCCESS);
                    return new fromAssociateAction.MapExchangeJobSuccess();
                }),
                catchError(() => of(new fromAssociateAction.MapExchangeJobsError()))
            )
        )
    );

    constructor(private actions$: Actions,
        private exchangeApiService: ExchangeApiService,
        private exchangeCompanyApiService: ExchangeCompanyApiService,
        private companyJobApiService: CompanyJobApiService,
        private windowCommunicationService: WindowCommunicationService) {
    }
}
