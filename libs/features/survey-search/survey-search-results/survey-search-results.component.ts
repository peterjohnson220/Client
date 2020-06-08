import { Component, Input, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchReducer from 'libs/features/search/reducers';
import { SurveySearchResultDataSources } from 'libs/constants';

import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import { DataCutDetails, JobResult, MatchesDetailsTooltipData, ProjectSearchContext } from '../models';
import { TooltipContainerComponent } from '../containers/tooltip-container';
import * as fromSurveySearchReducer from '../reducers';
import { hasMoreDataCuts } from '../helpers';

@Component({
  selector: 'pf-survey-search-results',
  templateUrl: './survey-search-results.component.html',
  styleUrls: ['./survey-search-results.component.scss']
})
export class SurveySearchResultsComponent {
  @ViewChild('tooltipContainer', { static: true }) tooltipContainer: TooltipContainerComponent;
  @Input() cutsDraggable: boolean;

  // Observables
  jobResults$: Observable<JobResult[]>;
  loadingResults$: Observable<boolean>;
  projectSearchContext$: Observable<ProjectSearchContext>;

  constructor(
    private store: Store<fromSurveySearchReducer.State>
  ) {
    this.jobResults$ = this.store.select(fromSurveySearchReducer.getResults);
    this.projectSearchContext$ = this.store.select(fromSurveySearchReducer.getProjectSearchContext);
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
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

}
