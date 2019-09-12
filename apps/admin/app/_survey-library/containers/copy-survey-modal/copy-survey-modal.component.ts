import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api';

import * as fromSurveysReducer from '../../reducers';
import * as fromSurveyActions from '../../actions/survey-actions';

@Component({
  selector: 'pf-copy-survey-modal',
  templateUrl: './copy-survey-modal.component.html',
  styleUrls: ['./copy-survey-modal.component.scss']
})
export class CopySurveyModalComponent {


  @Input() SurveyName: string;
  @Input() surveyId: number;

  isModalOpen$: Observable<boolean>;

  constructor(
    private surveyApi: SurveyLibraryApiService,
    private store: Store<fromSurveysReducer.State>
  ) {

    this.isModalOpen$ = this.store.select(fromSurveysReducer.isCopySurveyModalOpen);
  }

  addSurvey() {
    this.surveyApi.copySurvey(this.surveyId, this.SurveyName).subscribe(f =>
      this.handleModalDismissed()
    );
  }

  handleModalDismissed() {
    this.store.dispatch(new fromSurveyActions.ShouldRefreshGrid(true));
    this.store.dispatch(new fromSurveyActions.SetCopySurveyModalOpen(false));
  }
}
