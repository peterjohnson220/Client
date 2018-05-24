import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import {of} from 'rxjs/index';

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
    .ofType(fromJobFamilyActions.LOAD_JOB_FAMILIES)
    .switchMap(() => this.exchangeCompanyApiService.getPayfactorsJobFamilies()
      .map(results => {
        return new fromJobFamilyActions.LoadJobFamiliesSuccess(results);
      })
      .catch(() => of(new fromJobFamilyActions.LoadJobFamiliesError)));

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeRequestEffectsService: ExchangeRequestEffectsService
  ) {}
}
