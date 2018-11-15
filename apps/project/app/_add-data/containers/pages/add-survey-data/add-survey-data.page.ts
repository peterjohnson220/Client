import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { DataCut } from 'libs/models/survey-search';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromSearchActions from '../../../../shared/actions/search.actions';
import * as fromAddDataReducer from '../../../reducers';
import * as fromSharedReducer from '../../../../shared/reducers';
import { SurveySearchBase } from '../../../../shared/containers/pages/survey-search-base';
import { disableDatacutsDragging } from '../../../../shared/helpers';


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
    store: Store<fromSharedReducer.State>,
    private dragulaService: DragulaService
  ) {
    super(store);
    this.selectedCuts$ = this.store.select(fromSharedReducer.getSelectedDataCuts);
    this.addingData$ = this.store.select(fromAddDataReducer.getAddingData);
    this.pageShown$ = this.store.select(fromSharedReducer.getPageShown);
    this.excludeFromParticipation = false;
    disableDatacutsDragging(dragulaService);
  }

  onResetApp() {
    this.store.dispatch(new fromSearchActions.HidePage());
    this.excludeFromParticipation = false;
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromSearchActions.SetProjectSearchContext(payload.SearchContext));
    this.store.dispatch(new fromSearchActions.SetJobContext(payload.JobContext));
  }

  // Event Handling
  handleCancelClicked() {
    this.store.dispatch(new fromSearchActions.CloseSearchPage());
  }

  handleAddClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.AddData(this.excludeFromParticipation));
  }
}
