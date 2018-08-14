import { Component, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DataCut } from 'libs/models/survey-search';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromSurveyFiltersActions from '../../../actions/search-filters.actions';
import * as fromSurveyResultsActions from '../../../actions/search-results.actions';
import * as fromTooltipContainerActions from '../../../actions/tooltip-container.actions';
import * as fromAddDataReducer from '../../../reducers';


@Component({
  selector: 'pf-add-survey-data-page',
  templateUrl: './add-survey-data.page.html',
  styleUrls: ['./add-survey-data.page.scss']
})
export class AddSurveyDataPageComponent {
  excludeFromParticipation: boolean;
  selectedCuts$: Observable<DataCut[]>;
  addingData$: Observable<boolean>;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.selectedCuts$ = this.store.select(fromAddDataReducer.getSelectedDataCuts);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
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
        this.store.dispatch(new fromAddSurveyDataPageActions.SetJobContext(event.data.payfactorsMessage.payload));
        break;
      case 'App Closed':
        this.store.dispatch(new fromSurveyFiltersActions.ClearFilters());
        this.store.dispatch(new fromSurveyResultsActions.ClearResults());
        this.store.dispatch(new fromSurveyResultsActions.ClearDataCutSelections());
        this.store.dispatch(new fromTooltipContainerActions.CloseJobDetailsTooltip());
        this.excludeFromParticipation = false;
        break;
      case 'Hide App':
        this.store.dispatch(new fromTooltipContainerActions.CloseJobDetailsTooltip());
        break;
    }
  }

  handleCancelClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.CloseSurveySearch());
  }

  handleAddClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.AddData(this.excludeFromParticipation));
  }


}
