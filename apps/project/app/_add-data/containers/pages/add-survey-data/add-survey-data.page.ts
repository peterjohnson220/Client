import { Component, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DataCut } from 'libs/models/survey-search';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromSearchActions from '../../../actions/search.actions';
import * as fromSearchFiltersActions from '../../../actions/search-filters.actions';
import * as fromSurveyResultsActions from '../../../actions/search-results.actions';
import * as fromAddDataReducer from '../../../reducers';
import { Filter, Pill, PillGroup } from '../../../models';

@Component({
  selector: 'pf-add-survey-data-page',
  templateUrl: './add-survey-data.page.html',
  styleUrls: ['./add-survey-data.page.scss']
})
export class AddSurveyDataPageComponent {
  selectedCuts$: Observable<DataCut[]>;
  addingData$: Observable<boolean>;
  numberOfResults$: Observable<number>;
  searchingFilter$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  filters$: Observable<Filter[]>;

  filters: Filter[];
  excludeFromParticipation: boolean;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.selectedCuts$ = this.store.select(fromAddDataReducer.getSelectedDataCuts);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
    this.numberOfResults$ = this.store.select(fromAddDataReducer.getResultsTotal);
    this.searchingFilter$ = this.store.select(fromAddDataReducer.getSearchingFilter);
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    this.pageShown$ = this.store.select(fromAddDataReducer.getPageShown);
    this.excludeFromParticipation = false;
  }

  // Listen for messages to the window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (!event.data || !event.data.payfactorsMessage) {
      return;
    }

    switch (event.data.payfactorsMessage.type) {
      case 'Set Job Context':
        this.resetApp();
        this.store.dispatch(new fromSearchActions.SetProjectSearchContext(event.data.payfactorsMessage.payload.SearchContext));
        this.store.dispatch(new fromAddSurveyDataPageActions.SetJobContext(event.data.payfactorsMessage.payload.JobContext));
        break;
      case 'App Closed':
        this.resetApp();
        break;
    }
  }

  resetApp() {
    this.store.dispatch(new fromSearchFiltersActions.ClearFilters());
    this.store.dispatch(new fromSurveyResultsActions.ClearResults());
    this.store.dispatch(new fromSurveyResultsActions.ClearDataCutSelections());
    this.store.dispatch(new fromSearchActions.HideFilterSearch());
    this.excludeFromParticipation = false;
  }

  // Event Handling
  handleCancelClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.CloseSurveySearch());
  }

  handleAddClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.AddData(this.excludeFromParticipation));
  }

  handleResetFilters() {
    this.store.dispatch(new fromSearchFiltersActions.ResetAllFilters());
    this.store.dispatch(new fromSurveyResultsActions.ClearDataCutSelections());
  }

  handleClearPill(pill: Pill) {
    this.store.dispatch(new fromSearchFiltersActions.RemoveFilterValue({filterId: pill.FilterId, value: pill.Value}));
  }

  handleClearPillGroup(pillGroup: PillGroup) {
    this.store.dispatch(new fromSearchFiltersActions.ClearFilter(pillGroup.FilterId));
  }

  handleSaveFilters(isForAllPayMarkets: boolean): void {
    this.store.dispatch(new fromSearchFiltersActions.SaveSearchFilters({ isForAllPayMarkets }));
  }
}
