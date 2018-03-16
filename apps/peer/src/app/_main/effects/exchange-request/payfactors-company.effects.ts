import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { ExistingCompany, ExchangeRequestTypeEnum } from 'libs/models';

import { ExchangeRequestEffectsService } from '../../services';
import * as fromPeerMainReducers from '../../reducers';

@Injectable()
export class PayfactorsCompanyExchangeRequestEffects {
  type = ExchangeRequestTypeEnum.ReferPayfactorsCompany;

  @Effect()
  openModal$: Observable<Action> = this.exchangeRequestEffectsService.openModal(this.type);

  @Effect()
  closeModal$: Observable<Action> = this.exchangeRequestEffectsService.closeModal(this.type);

  @Effect()
  loadCandidates$: Observable<Action> = this.exchangeRequestEffectsService.loadCandidates<ExistingCompany>(
    this.type,
    fromPeerMainReducers.getAccessExchangeRequestContext,
    // TODO: Constants for endpoints
    'GetTopExchangeCandidates'
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
