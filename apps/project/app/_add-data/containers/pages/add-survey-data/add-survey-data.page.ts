import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromSearchReducer from 'libs/features/search/reducers';
import { SearchBase } from 'libs/features/search/containers/search-base';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import { SearchFeatureIds } from 'libs/features/search/enums/search-feature-ids';
import { DataCutDetails } from 'libs/features/survey-search/models';
import * as fromSurveySearchReducer from 'libs/features/survey-search/reducers';
import * as fromContextActions from 'libs/features/survey-search/actions/context.actions';
import { disableDatacutsDragging } from 'libs/features/survey-search/helpers';
import * as fromSurveySearchResultsActions from 'libs/features/survey-search/actions/survey-search-results.actions';
import { staticFilters, SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/survey-search/data';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromAddDataReducer from '../../../reducers';

@Component({
  selector: 'pf-add-survey-data-page',
  templateUrl: './add-survey-data.page.html',
  styleUrls: ['./add-survey-data.page.scss']
})
export class AddSurveyDataPageComponent extends SearchBase {
  selectedCuts$: Observable<DataCutDetails[]>;
  addingData$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  excludeFromParticipation: boolean;
  featureImplementation = 'component';

  constructor(
    store: Store<fromSearchReducer.State>,
    private dragulaService: DragulaService
  ) {
    super(store, SurveySearchFilterMappingDataObj, SearchFeatureIds.AddSurveyData, SurveySearchUserFilterType);
    this.selectedCuts$ = this.store.select(fromSurveySearchReducer.getSelectedDataCuts);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
    this.excludeFromParticipation = false;
    disableDatacutsDragging(dragulaService);
  }

  onResetApp() {
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
    this.excludeFromParticipation = false;
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));
    this.store.dispatch(new fromContextActions.SetProjectSearchContext(payload.SearchContext));
    this.store.dispatch(new fromContextActions.SetJobContext(payload.JobContext));
    this.store.dispatch(new fromAddSurveyDataPageActions.ResetAddData());
  }

  // Event Handling
  handleAddClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.AddData(this.excludeFromParticipation));
  }
}
