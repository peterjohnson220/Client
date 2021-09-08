import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { ExchangeDataSet } from 'libs/models/comphub';
import { OrgIncCount } from 'libs/models/payfactors-api/peer/exchange-data-search/response';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';

import { ComphubPages } from '../../../../_shared/data';
import { WorkflowContext } from '../../../../_shared/models';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import * as fromComphubSharedReducers from '../../../../_shared/reducers';
import * as fromPeerTrendsDataReducers from '../../../reducers';
import { debounceTime } from 'rxjs/operators';
import { PageViewIds } from '../../../constants';

@Component({
  selector: 'pf-trends-landing-card',
  templateUrl: './trends-landing.card.component.html',
  styleUrls: ['./trends-landing.card.component.scss']
})
export class TrendsLandingCardComponent implements OnInit, OnDestroy {

  workflowContext$: Observable<WorkflowContext>;
  exchangeDataSets$: Observable<ExchangeDataSet[]>;
  newCompanies$: Observable<AsyncStateObj<string[]>>;
  comphubPages = ComphubPages;
  orgIncCountHistory$: Observable<AsyncStateObj<OrgIncCount[]>>;
  selectedPageIdDelayed$: Observable<string>;

  selectedPageIdDelayedSubscription: Subscription;

  constructor (private store: Store<fromComphubSharedReducers.State>) {
    this.workflowContext$ = this.store.select(fromComphubSharedReducers.getWorkflowContext);
    this.exchangeDataSets$ = this.store.select(fromComphubSharedReducers.getExchangeDataSets);
    this.newCompanies$ = this.store.select(fromPeerTrendsDataReducers.getNewExchangeParticipants);
    this.orgIncCountHistory$ = this.store.select(fromPeerTrendsDataReducers.getOrgIncCountHistory);
    this.selectedPageIdDelayed$ = this.store.select(fromComphubSharedReducers.getSelectedPageId).pipe(debounceTime(750));
  }

  handleExchangeDataSetChanged(exchangeId: number) {
    this.store.dispatch(new fromComphubPageActions.UpdateActiveExchangeDataSet(exchangeId));
  }

  ngOnInit(): void {
    this.selectedPageIdDelayedSubscription = this.selectedPageIdDelayed$.subscribe(id => {
      if (id === ComphubPages.TrendsLanding) {

        this.store.dispatch(new fromPfDataGridActions.UpdateSelectedRecordId(PageViewIds.Trends, null, null));
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedPageIdDelayedSubscription.unsubscribe();
  }
}
