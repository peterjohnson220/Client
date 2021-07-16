import {Component, Input} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { SearchBaseDirective } from 'libs/features/search/search/containers/search-base';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import { DataCutDetails } from 'libs/features/surveys/survey-search/models';
import * as fromSurveySearchReducer from 'libs/features/surveys/survey-search/reducers';
import * as fromContextActions from 'libs/features/surveys/survey-search/actions/context.actions';
import * as fromSurveySearchResultsActions from 'libs/features/surveys/survey-search/actions/survey-search-results.actions';
import { getSearchFilters, SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/surveys/survey-search/data';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';

import * as fromAddSurveyDataActions from '../actions/add-data.actions';
import * as fromAddDataReducer from '../reducers';

@Component({
  selector: 'pf-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent extends SearchBaseDirective {
  @Input() display: 'component' | 'modal' = 'component';
  selectedCuts$: Observable<DataCutDetails[]>;
  addingData$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  excludeFromParticipation: boolean;
  featureImplementation = 'component';
  matchMode: boolean;
  showAddModal$: Observable<boolean>;
  loadingResults$: Observable<boolean>;
  searchError$: Observable<boolean>;
  constructor(
    store: Store<fromSearchReducer.State>,
    private dragulaService: DragulaService,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    super(store, SurveySearchFilterMappingDataObj, SearchFeatureIds.AddSurveyData, SurveySearchUserFilterType);
    this.matchMode = this.featureFlagService.enabled(FeatureFlags.SurveySearchLightningMode, false);
    this.selectedCuts$ = this.store.select(fromSurveySearchReducer.getSelectedDataCuts);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.excludeFromParticipation = false;
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
    this.searchError$ = this.store.select(fromSearchReducer.getSearchResultsError);
    this.showAddModal$ = this.store.select(fromAddDataReducer.getShowModal);

  }

  onResetApp() {
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
    this.excludeFromParticipation = false;
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(getSearchFilters(this.matchMode)));
    this.store.dispatch(new fromContextActions.SetProjectSearchContext(payload.SearchContext));
    this.store.dispatch(new fromContextActions.SetJobContext(payload.JobContext));
    this.store.dispatch(new fromAddSurveyDataActions.ResetAddData());
  }
  // Event Handling
  handleAddClicked() {
    this.store.dispatch(new fromAddSurveyDataActions.AddData(this.excludeFromParticipation));
  }
  handleCancelClicked() {
    super.handleCancelClicked();
    super.resetApp();
    if (this.display === 'modal') {
      this.store.dispatch( new fromAddSurveyDataActions.SetAddDataModalStatus(false));
    }
  }
}
