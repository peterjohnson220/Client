import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';


import { ExchangeApiService } from 'libs/data/payfactors-api';
import { GenericKeyValue, AutoAssociateExchangeJobsRequest } from 'libs/models';
import * as fromAssociateJobsActions from 'libs/features/peer/job-association-match/actions/associate-jobs.actions';

import * as fromCompanyOptionsActions from '../actions/exchange-job-association-utility/company-options.actions';
import * as fromExchangeOptionsActions from '../actions/exchange-job-association-utility/exchange-options.actions';


@Injectable()
export class ExchangeJobAssociationUtilityEffects {

  @Effect()
  loadCompanyOptions$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyOptionsActions.LOAD_COMPANY_OPTIONS),
    switchMap(() =>
      this.exchangeApiService.getPeerParticipantsDictionary().pipe(
        map((companyOptions: GenericKeyValue<number, string>[]) => new fromCompanyOptionsActions
          .LoadCompanyOptionsSuccess(companyOptions)),
        catchError(() => of(new fromCompanyOptionsActions.LoadCompanyOptionsError()))
      )
    )
  );

  @Effect()
  loadExchangeOptions$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeOptionsActions.LOAD_EXCHANGE_OPTIONS),
    map((action: fromExchangeOptionsActions.LoadExchangeOptions) => action.payload),
    switchMap((companyId: number) =>
      this.exchangeApiService.getExchangeDictionaryForCompany(companyId).pipe(
        map((exchangeOptions: GenericKeyValue<number, string>[]) => new fromExchangeOptionsActions
          .LoadExchangeOptionsSuccess(exchangeOptions)),
        catchError(() => of(new fromExchangeOptionsActions.LoadExchangeOptionsError()))
      )
    )
  );

  @Effect()
  associateJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromAssociateJobsActions.ASSOCIATE_JOBS),
    map((action: fromAssociateJobsActions.AssociateJobs) => action.payload),
    switchMap((associateJobsRequest: AutoAssociateExchangeJobsRequest) =>
      this.exchangeApiService.autoAssociateExchangeJobs(associateJobsRequest).pipe(
        map((associationsAdded: number) => new fromAssociateJobsActions.AssociateJobsSuccess(associationsAdded)),
        catchError(() => of(new fromAssociateJobsActions.AssociateJobsError()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) { }
}
