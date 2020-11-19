import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSearchReducer from 'libs/features/search/reducers';
import { SurveySearchResultDataSources } from 'libs/constants';

import { DataCutDetails, JobResult, MatchesDetailsTooltipData, PricingMatchDataSearchContext } from '../models';
import { TooltipContainerComponent } from '../containers/tooltip-container';
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
  @Input() refineInPeerEnabled = false;
  @Input() refineInPeerReadyDefault = false;

  refineInPeerByJobTitle = false;
  refineInPeerReady = false;
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
      this.refineInPeerReady = this.refineInPeerReadyDefault;
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
        this.refineInPeerReady = true;
        this.refineInPeerByJobTitle = false;
        break;
      case 'Refine Exchange Job Title Search Enabled':
        this.refineInPeerReady = true;
        this.refineInPeerByJobTitle = true;
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
        this.store.dispatch(new fromSurveySearchResultsActions.GetExchangeDataResults(job));
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

  handleRefineInPeerClicked(job): void {
    if (this.refineInPeerEnabled) {
      const exchangeJob = job.PeerJobInfo;
      const payload = !this.refineInPeerByJobTitle ? {lockedExchangeJobId: exchangeJob.ExchangeJobId} :
        {exchangeId: exchangeJob.ExchangeId, exchangeJobTitle: job.Title};
      this.store.dispatch(new fromSurveySearchResultsActions.RefineExchangeJobResult(payload));
    }
  }
}
