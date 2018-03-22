import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AvailableExchangeItem, ExchangeRequestTypeEnum, CompanyOption } from 'libs/models';
import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import * as fromExchangeListActions from 'libs/features/peer/actions/exchange-list.actions';

import { ExchangeRequestEffectsService } from '../../services';
import * as fromPeerMainReducers from '../../reducers';
import * as fromPeerParticipantsActions from '../../actions/peer-participants.actions';

@Injectable()
export class AccessExchangeRequestEffects {
  type = ExchangeRequestTypeEnum.Access;

  @Effect()
  openModal$: Observable<Action> = this.exchangeRequestEffectsService.openModal(this.type);

  @Effect()
  closeModal$: Observable<Action> = this.exchangeRequestEffectsService.closeModal(this.type);

  @Effect()
  loadCandidates$: Observable<Action> = this.exchangeRequestEffectsService.loadCandidates<AvailableExchangeItem>(
    this.type,
    fromPeerMainReducers.getAccessExchangeRequestContext
  );

  @Effect()
  updateSearchTerm$: Observable<Action> = this.exchangeRequestEffectsService.updateSearchTerm(this.type);

  @Effect()
  updateCompanyFilter$: Observable<Action> = this.exchangeRequestEffectsService.updateFilterOptions(this.type);

  @Effect()
  createExchangeRequest$: Observable<Action> = this.exchangeRequestEffectsService.createExchangeRequest(
    this.type,
    [new fromExchangeListActions.LoadingExchanges]
  );

  @Effect()
  loadPeerParticipants$: Observable<Action> = this.actions$
    .ofType(fromPeerParticipantsActions.LOAD_PEER_PARTICIPANTS)
    .map((action: fromPeerParticipantsActions.LoadPeerParticipants) => action.payload)
    .switchMap(searchTerm =>
      this.exchangeApiService.getTopPeerParticipants(searchTerm)
        .map((companyOptions: CompanyOption[]) => new fromPeerParticipantsActions
          .LoadPeerParticipantsSuccess(companyOptions))
        .catch(() => of(new fromPeerParticipantsActions.LoadPeerParticipantsError))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private exchangeRequestEffectsService: ExchangeRequestEffectsService
  ) {}
}
