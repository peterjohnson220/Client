import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { RelationalExchangeJobSearchComponent } from 'libs/features/peer/relational-exchange-job-search/containers';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';
import * as fromLibsPeerRelationalExchangeJobSearchReducer from 'libs/features/peer/relational-exchange-job-search/reducers';

import { ComphubPages } from '../../../../_shared/data';
import * as fromComphubSharedReducers from '../../../../_shared/reducers';

import * as fromPeerTrendsDataReducers from '../../../reducers';
import * as fromTrendsJobsCardActions from '../../../actions/trends-jobs.actions';

@Component({
  selector: 'pf-trends-jobs-card',
  templateUrl: './trends-jobs.card.component.html',
  styleUrls: ['./trends-jobs.card.component.scss']
})
export class TrendsJobsCardComponent implements OnInit, OnDestroy {
  @ViewChild(RelationalExchangeJobSearchComponent) public relationalExchangeJobSearchComponent: RelationalExchangeJobSearchComponent;

  activeExchangeId$: Observable<number>;
  selectedPageId$: Observable<string>;

  selectedExchangeJobResults$: Observable<any[]>;

  exchangeJobSearchOptionsSub: Subscription;
  selectedExchangeJobResultsSub: Subscription;
  selectedPageIdSub: Subscription;

  comphubPages = ComphubPages;
  activeExchangeId: number;

  constructor(private store: Store<fromPeerTrendsDataReducers.State>) {
    this.activeExchangeId$ = this.store.select(fromComphubSharedReducers.getActiveExchangeId);
    this.selectedExchangeJobResults$ = this.store.select(fromLibsPeerRelationalExchangeJobSearchReducer.getSelectedExchangeJobs);
    this.selectedPageId$ = this.store.select(fromComphubSharedReducers.getSelectedPageId);
  }

  setContext(): void {
    if (!!this.activeExchangeId) {
      this.relationalExchangeJobSearchComponent.initExchangeJobSearch(this.activeExchangeId);
    }
  }

  reset(): void {
    this.store.dispatch(new fromSearchFeatureActions.ResetSearchFeatureId(SearchFeatureIds.PeerExchangeJob));
    this.relationalExchangeJobSearchComponent.clear();
  }

  ngOnInit(): void {
    this.activeExchangeId$.subscribe(e => {
      this.activeExchangeId = e;
    });

    this.selectedExchangeJobResultsSub = this.selectedExchangeJobResults$.subscribe(ejs => {
      if (!!ejs?.length) {
        this.store.dispatch(new fromTrendsJobsCardActions.SetSelectedJobs(ejs.map(ej => <ExchangeJobSearchOption>{
          ExchangeJobId: ej.ExchangeJobId, JobTitle: ej.JobTitle
        })));
      } else {
        this.store.dispatch(new fromTrendsJobsCardActions.ClearSelectedJobs());
      }
    });
  }

  ngOnDestroy(): void {
    this.exchangeJobSearchOptionsSub.unsubscribe();
  }
}
