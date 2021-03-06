import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { SurveySearchResultDataSources } from 'libs/constants';

import { DataCutDetails, JobResult, MatchesDetailsTooltipData, PricingMatchDataSearchContext } from '../models';
import { TooltipContainerComponent } from '../containers';
import { hasMoreDataCuts } from '../helpers';
import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import * as fromSurveySearchReducer from '../reducers';

@Component({
  selector: 'pf-survey-search-results',
  templateUrl: './survey-search-results.component.html',
  styleUrls: ['./survey-search-results.component.scss']
})
export class SurveySearchResultsComponent implements OnInit {
  @ViewChild('tooltipContainer', { static: true }) tooltipContainer: TooltipContainerComponent;
  @Input() cutsDraggable: boolean;
  @Input() implementation: string;
  @Input() customizeInPeerEnabled = false;
  @Input() customizeInPeerReadyDefault = false;

  customizeInPeerReady = false;
  // Observables
  jobResults$: Observable<JobResult[]>;
  loadingResults$: Observable<boolean>;
  pricingMatchDataSearchContext$: Observable<PricingMatchDataSearchContext>;
  legacyIframeImplementation: boolean;

  // subscriptions
  contextSub: Subscription;

  constructor(
    private store: Store<fromSurveySearchReducer.State>
  ) {
    this.jobResults$ = this.store.select(fromSurveySearchReducer.getResults);
    this.pricingMatchDataSearchContext$ = this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext);
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
  }

  ngOnInit() {
    this.contextSub = this.pricingMatchDataSearchContext$.subscribe(c => {
      this.customizeInPeerReady = this.customizeInPeerReadyDefault;
    });
    this.legacyIframeImplementation = this.implementation === 'component';
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (!event.data || !event.data.payfactorsMessage) {
      return;
    }

    switch (event.data.payfactorsMessage.type) {
      case 'Refine Exchange Job Enabled':
        this.customizeInPeerReady = true;
        break;
    }
  }

  // Events
  handleLoadDataCuts(job: JobResult): void {
    if ((job.DataCuts.length && !hasMoreDataCuts(job)) || job.DataSource === SurveySearchResultDataSources.Payfactors) {
      return;
    }

    switch (job.DataSource) {
      case SurveySearchResultDataSources.Surveys :
        this.store.dispatch(new fromSurveySearchResultsActions.GetSurveyDataResults(job));
        break;
      case SurveySearchResultDataSources.Peer:
        const exchangeJobId = job.PeerJobInfo.ExchangeJobId;
        this.store.dispatch(new fromSurveySearchResultsActions.GetExchangeDataResults({exchangeJobId}));
        break;
    }
  }

  handleCutSelectionToggle(data: DataCutDetails): void {
    this.store.dispatch(new fromSurveySearchResultsActions.ToggleDataCutSelection(data));
  }

  trackByJobId(index, item: JobResult) {
    return item.Id;
  }

  handleMatchesMouseEnter(data: MatchesDetailsTooltipData): void {
    this.tooltipContainer.handleMatchesMouseEnter(data);
  }

  handleMatchesMouseLeave(): void {
    this.tooltipContainer.handleMatchesMouseLeave();
  }

  handleCustomizeInPeerClicked(job): void {
    if (this.customizeInPeerEnabled) {
      const exchangeJob = job.PeerJobInfo;
      this.store.dispatch(new fromSurveySearchResultsActions.RefineExchangeJobResult({lockedExchangeJobId: exchangeJob.ExchangeJobId}));
    }
  }
}
