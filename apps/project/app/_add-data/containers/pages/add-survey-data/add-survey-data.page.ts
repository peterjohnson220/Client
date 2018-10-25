import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DataCut } from 'libs/models/survey-search';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromSearchActions from '../../../actions/search.actions';
import * as fromAddDataReducer from '../../../reducers';
import { SurveySearchBase } from '../survey-search-base';

@Component({
  selector: 'pf-add-survey-data-page',
  templateUrl: './add-survey-data.page.html',
  styleUrls: ['./add-survey-data.page.scss']
})
export class AddSurveyDataPageComponent extends SurveySearchBase {
  selectedCuts$: Observable<DataCut[]>;
  addingData$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  excludeFromParticipation: boolean;

  constructor(
    store: Store<fromAddDataReducer.State>
  ) {
    super(store);
    this.selectedCuts$ = this.store.select(fromAddDataReducer.getSelectedDataCuts);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
    this.pageShown$ = this.store.select(fromAddDataReducer.getPageShown);
    this.excludeFromParticipation = false;
  }

  onResetApp() {
    this.excludeFromParticipation = false;
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromSearchActions.SetProjectSearchContext(payload.SearchContext));
    this.store.dispatch(new fromAddSurveyDataPageActions.SetJobContext(payload.JobContext));
  }

  // Event Handling
  handleCancelClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.CloseSurveySearch());
  }

  handleAddClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.AddData(this.excludeFromParticipation));
  }
}
