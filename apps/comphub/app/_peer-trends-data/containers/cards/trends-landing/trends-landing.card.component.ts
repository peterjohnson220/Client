import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { ExchangeDataSet } from 'libs/models/comphub';
import { OrgIncCount } from 'libs/models/payfactors-api/peer/exchange-data-search/response';

import { ComphubPages } from '../../../../_shared/data';
import { WorkflowContext } from '../../../../_shared/models';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import * as fromComphubSharedReducers from '../../../../_shared/reducers';

import * as fromPeerTrendsDataReducers from '../../../reducers';

@Component({
  selector: 'pf-trends-landing-card',
  templateUrl: './trends-landing.card.component.html',
  styleUrls: ['./trends-landing.card.component.scss']
})
export class TrendsLandingCardComponent {

  workflowContext$: Observable<WorkflowContext>;
  exchangeDataSets$: Observable<ExchangeDataSet[]>;
  newCompanies$: Observable<AsyncStateObj<string[]>>;
  comphubPages = ComphubPages;
  orgIncCountHistory$: Observable<AsyncStateObj<OrgIncCount[]>>;

  constructor (private store: Store<fromComphubSharedReducers.State>) {
    this.workflowContext$ = this.store.select(fromComphubSharedReducers.getWorkflowContext);
    this.exchangeDataSets$ = this.store.select(fromComphubSharedReducers.getExchangeDataSets);
    this.newCompanies$ = this.store.select(fromPeerTrendsDataReducers.getNewExchangeParticipants);
    this.orgIncCountHistory$ = this.store.select(fromPeerTrendsDataReducers.getOrgIncCountHistory);
  }

  handleExchangeDataSetChanged(exchangeId: number) {
    this.store.dispatch(new fromComphubPageActions.UpdateActiveExchangeDataSet(exchangeId));
  }
}
