import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { ExchangeRequestTypeEnum } from 'libs/models';

import { ExchangeJobRequestCandidate } from '../models';
import * as fromPeerManagementReducer from '../reducers';
import { ExchangeRequestEffectsService } from '../../shared/services';

@Injectable()
export class PayfactorsJobExchangeRequestEffects {
  type = ExchangeRequestTypeEnum.PayfactorsJob;

  @Effect()
  openModal$: Observable<Action> = this.exchangeRequestEffectsService.openModal(this.type);

  @Effect()
  closeModal$: Observable<Action> = this.exchangeRequestEffectsService.closeModal(this.type);

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
  createExchangeRequest$: Observable<Action> = this.exchangeRequestEffectsService.createExchangeRequest(this.type);

  constructor(
    private exchangeRequestEffectsService: ExchangeRequestEffectsService
  ) {}
}
