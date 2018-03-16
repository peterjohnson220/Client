import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/mergeMap';

import { ExchangeRequestTypeEnum } from 'libs/models/peer';

import { ExchangeRequestEffectsService } from '../../services';

@Injectable()
export class ExchangeAccessEffects {
  type = ExchangeRequestTypeEnum.Access;

  @Effect()
  openModal$: Observable<Action> = this.exchangeRequestEffectsService.openExchangeRequestModal(this.type);

  @Effect()
  closeModal$: Observable<Action> = this.exchangeRequestEffectsService.closeExchangeRequestModal(this.type);

  @Effect()
  loadCandidates$: Observable<Action> = this.exchangeRequestEffectsService.loadCandidates(this.type);

  constructor(
    private exchangeRequestEffectsService: ExchangeRequestEffectsService
  ) {}
}
