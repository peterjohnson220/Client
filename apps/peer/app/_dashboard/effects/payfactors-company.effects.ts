import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { ExchangeRequestTypeEnum } from 'libs/models';

import * as fromPeerDashboardReducer from '../reducers';
import { ExistingCompany } from '../models';
import { ExchangeRequestEffectsService } from '../../shared/services';

@Injectable()
export class PayfactorsCompanyExchangeRequestEffects {
  type = ExchangeRequestTypeEnum.ReferPayfactorsCompany;

  @Effect()
  openModal$: Observable<Action> = this.exchangeRequestEffectsService.openModal(this.type);

  @Effect()
  loadCandidates$: Observable<Action> = this.exchangeRequestEffectsService.loadCandidates<ExistingCompany>(
    this.type,
    fromPeerDashboardReducer.getPfCompaniesExchangeRequestContext
  );

  @Effect()
  updateSearchTerm$: Observable<Action> = this.exchangeRequestEffectsService.updateSearchTerm(this.type);

  @Effect()
  updateCompanyFilter$: Observable<Action> = this.exchangeRequestEffectsService.updateFilterOptions(this.type);

  @Effect()
  createExchangeRequest$: Observable<Action> = this.exchangeRequestEffectsService.createExchangeRequest(this.type);

  @Effect()
  resetExchangeRequest$: Observable<Action> = this.exchangeRequestEffectsService.reset(this.type);
  constructor(
    private exchangeRequestEffectsService: ExchangeRequestEffectsService
  ) {}
}
