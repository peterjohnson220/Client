import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { ExchangeRequestTypeEnum } from 'libs/models';
import {ExchangeCompanyApiService} from 'libs/data/payfactors-api';

import { ExchangeJobRequestCandidate } from '../models';
import * as fromPeerManagementReducer from '../reducers';
import * as fromJobFamilyActions from '../actions/job-family.actions';
import { ExchangeRequestEffectsService } from '../../shared/services';

@Injectable()
export class PayfactorsJobExchangeRequestEffects {
  type = ExchangeRequestTypeEnum.PayfactorsJob;

  @Effect()
  openModal$: Observable<Action> = this.exchangeRequestEffectsService.openModal(this.type);

  @Effect()
  loadCandidates$: Observable<Action> = this.exchangeRequestEffectsService.loadCandidates<ExchangeJobRequestCandidate>(
    this.type,
    fromPeerManagementReducer.getPfJobsExchangeRequestContext
  );

  @Effect()
  updateSearchTerm$: Observable<Action> = this.exchangeRequestEffectsService.updateSearchTerm(this.type);

  @Effect()
  updateCompanyFilter$: Observable<Action> = this.exchangeRequestEffectsService.updateFilterOptions(this.type);

  @Effect()
  resetExchangeRequest$: Observable<Action> = this.exchangeRequestEffectsService.reset(this.type);

  @Effect()
  createExchangeRequest$: Observable<Action> = this.exchangeRequestEffectsService.createExchangeRequest(this.type);

  @Effect()
  loadJobFamilies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobFamilyActions.LOAD_JOB_FAMILIES),
      switchMap(() => this.exchangeCompanyApiService.getPayfactorsJobFamilies().pipe(
        map(results => {
          return new fromJobFamilyActions.LoadJobFamiliesSuccess(results);
        }),
        catchError(() => of(new fromJobFamilyActions.LoadJobFamiliesError))
      ))
    );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeRequestEffectsService: ExchangeRequestEffectsService
  ) {}
}
