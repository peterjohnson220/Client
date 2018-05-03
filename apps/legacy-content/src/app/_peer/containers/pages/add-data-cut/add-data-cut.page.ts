import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { SystemFilter, ExchangeMapSummary } from 'libs/models/peer';
import * as fromPeerMapReducers from 'libs/features/peer/map/reducers';
import * as fromFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';

import * as fromAddDataCutPageActions from '../../../actions/add-data-cut-page.actions';
import { GuidelineLimits } from '../../../models';
import * as fromAddPeerDataReducers from '../../../reducers';

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
  systemFilter$: Observable<SystemFilter>;
  addDataCutPageInViewInIframe$: Observable<boolean>;

  constructor(
    private store: Store<fromAddPeerDataReducers.State>,
    private mapStore: Store<fromPeerMapReducers.State>,
    private route: ActivatedRoute
  ) {
    this.addingDataCut$ = this.store.select(fromAddPeerDataReducers.getAddDataCutAddingDataCut);
    this.addingDataCutError$ = this.store.select(fromAddPeerDataReducers.getAddDataCutAddingDataCutError);
    this.peerMapSummary$ = this.mapStore.select(fromPeerMapReducers.getPeerMapSummary);
    this.initialMapMoveComplete$ = this.mapStore.select(fromPeerMapReducers.getPeerMapInitialMapMoveComplete);
    this.systemFilter$ = this.store.select(fromPeerMapReducers.getSystemFilter);
    this.addDataCutPageInViewInIframe$ = this.store.select(fromAddPeerDataReducers.getAddDataCutPageInViewInIframe);
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

    this.store.dispatch(new fromFilterSidebarActions.LoadSystemFilter({
      CompanyJobId: this.companyJobId,
      CompanyPayMarketId: this.companyPayMarketId
    }));
  }


  // Add Data cut page within marketdata.asp specific code
  @HostListener('window:message', ['$event'])
  onMessage(ev) {
    if (this.inIframe() && ev.data === 'peer-exchange-tab-clicked') {
      // Hack. Wait a little before telling the client app that page is now in view in
      // an IFrame. Need to do this to allow the css positioning of the map to finish on the ASP side
      // before passing off the bounds to the map to initialize zooming. Otherwise we will run into the "Zoom Bug"
      // where the map does not zoom all the way in.
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
}
