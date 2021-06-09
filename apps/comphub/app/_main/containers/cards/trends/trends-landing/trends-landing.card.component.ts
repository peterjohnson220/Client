import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { OrgIncCount } from 'libs/models/payfactors-api/peer/exchange-data-search/response';

import { ComphubPages } from '../../../../data';
import { ExchangeDataSet, WorkflowContext } from '../../../../models';
import * as fromComphubPageActions from '../../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../../reducers';

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
  orgIncCountHistory$: Observable<AsyncStateObj<OrgIncCount[]>>

  constructor (private store: Store<fromComphubMainReducer.State>) {
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.exchangeDataSets$ = this.store.select(fromComphubMainReducer.getExchangeDataSets);
    this.newCompanies$ = this.store.select(fromComphubMainReducer.getNewExchangeParticipants);
    this.orgIncCountHistory$ = this.store.select(fromComphubMainReducer.getOrgIncCountHistory);
  }

  handleExchangeDataSetChanged(exchangeId: number) {
    this.store.dispatch(new fromComphubPageActions.UpdateActiveExchangeDataSet(exchangeId));
  }
}
