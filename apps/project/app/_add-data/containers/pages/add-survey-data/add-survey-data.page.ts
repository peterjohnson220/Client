import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromSearchSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromAddDataReducer from '../../../reducers';

import { DataCutDetails } from '../../../../survey-search/models';
import * as fromSurveySearchReducer from '../../../../survey-search/reducers';
import * as fromContextActions from '../../../../survey-search/actions/context.actions';
import { SurveySearchBase } from '../../../../survey-search/containers/pages/survey-search-base';
import { disableDatacutsDragging } from '../../../../survey-search/helpers';

@Component({
  selector: 'pf-add-survey-data-page',
  templateUrl: './add-survey-data.page.html',
  styleUrls: ['./add-survey-data.page.scss']
})
export class AddSurveyDataPageComponent extends SurveySearchBase {
  selectedCuts$: Observable<DataCutDetails[]>;
  addingData$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  excludeFromParticipation: boolean;

  constructor(
    store: Store<fromSurveySearchReducer.State>,
    private dragulaService: DragulaService
  ) {
    super(store);
    this.selectedCuts$ = this.store.select(fromSurveySearchReducer.getSelectedDataCuts);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.excludeFromParticipation = false;
    disableDatacutsDragging(dragulaService);
  }

  onResetApp() {
    this.store.dispatch(new fromSearchSearchPageActions.HidePage());
    this.excludeFromParticipation = false;
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromContextActions.SetProjectSearchContext(payload.SearchContext));
    this.store.dispatch(new fromContextActions.SetJobContext(payload.JobContext));
    this.store.dispatch(new fromAddSurveyDataPageActions.ResetAddData());
  }

  // Event Handling
  handleCancelClicked() {
    this.store.dispatch(new fromSearchSearchPageActions.CloseSearchPage());
  }

  handleAddClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.AddData(this.excludeFromParticipation));
  }
}
