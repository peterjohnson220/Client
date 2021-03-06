import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ExchangeRequestTypeEnum } from 'libs/models';
import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';

import * as fromCompanyIndustriesActions from '../actions/company-industries.actions';
import * as fromPeerDashboardReducer from '../reducers';
import { ExistingCompany } from '../models';
import { ExchangeRequestEffectsService } from '../../shared/services';

@Injectable()
export class InviteCompanyEffects {
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

  @Effect()
  loadJobFamilies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyIndustriesActions.LOAD_COMPANY_INDUSTRIES),
      switchMap(() => this.exchangeCompanyApiService.getCompanyIndustries().pipe(
        map(results => {
          return new fromCompanyIndustriesActions.LoadCompanyIndustriesSuccess(results);
        }),
        catchError(() => of(new fromCompanyIndustriesActions.LoadCompanyIndustriesError)))
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeRequestEffectsService: ExchangeRequestEffectsService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}
