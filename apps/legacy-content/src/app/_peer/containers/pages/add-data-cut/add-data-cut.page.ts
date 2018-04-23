import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ExchangeJobPayMarketFilter, ExchangeMapSummary } from 'libs/models/peer';

import * as fromAddDataCutPageActions from '../../../actions/add-data-cut-page.actions';
import { GuidelineLimits } from '../../../models';
import * as fromPeerDataReducers from '../../../reducers';
import { PageInViewInIframe } from '../../../actions/add-data-cut-page.actions';

@Component({
  selector: 'pf-add-data-cut-page',
  templateUrl: './add-data-cut.page.html',
  styleUrls: ['./add-data-cut.page.scss']
})
export class AddDataCutPageComponent implements OnInit {
  companyJobId: number;
  companyPayMarketId: number;
  userSessionId: number;
  readonly guidelineLimits: GuidelineLimits = { MinCompanies: 5, DominatingPercentage: .25 };

  addingDataCut$: Observable<boolean>;
  addingDataCutError$: Observable<boolean>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  initialMapMoveComplete$: Observable<boolean>;
  exchangeJobPayMarketFilter$: Observable<ExchangeJobPayMarketFilter>;

  constructor(private store: Store<fromPeerDataReducers.State>, private route: ActivatedRoute) {
    this.addingDataCut$ = this.store.select(fromPeerDataReducers.getAddDataCutAddingDataCut);
    this.addingDataCutError$ = this.store.select(fromPeerDataReducers.getAddDataCutAddingDataCutError);
    this.peerMapSummary$ = this.store.select(fromPeerDataReducers.getPeerMapSummary);
    this.initialMapMoveComplete$ = this.store.select(fromPeerDataReducers.getPeerMapInitialMapMoveComplete);
    this.exchangeJobPayMarketFilter$ = this.store.select(fromPeerDataReducers.getExchangeJobPayMarketFilter);
  }

  add() {
    this.store.dispatch(new fromAddDataCutPageActions.AddingDataCut({
      CompanyJobId: this.companyJobId,
      CompanyPayMarketId: this.companyPayMarketId,
      UserSessionId: this.userSessionId
    }));
  }

  cancel() {
    this.store.dispatch(new fromAddDataCutPageActions.CancelAddDataCut());
  }

  // Lifecycle events
  ngOnInit(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.companyJobId = +queryParamMap.get('companyJobId') || 0;
    this.companyPayMarketId = +queryParamMap.get('companyPayMarketId') || 0;
    this.userSessionId = +queryParamMap.get('userSessionId') || 0;

    this.loadExchangeJobAndPayMarketFilter();
  }

  @HostListener('window:message', ['$event'])
  onMessage(ev) {
    if (this.inIframe() && ev.data === 'peer-exchange-tab-clicked') {
      setTimeout(() => {
        this.store.dispatch(new fromAddDataCutPageActions.PageInViewInIframe());
      }, 100);
    }
  }

  inIframe () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  loadExchangeJobAndPayMarketFilter() {
    this.store.dispatch(new fromAddDataCutPageActions.LoadingExchangeJobPayMarketFilter({
      CompanyJobId: this.companyJobId,
      CompanyPayMarketId: this.companyPayMarketId
    }));
  }
}
