import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { SurveyLibraryStateService } from '../../services/survey-library-state.service';
import * as fromSurveyLibraryReducer from '../../reducers';
import * as fromSurveyTitlesActions from '../../actions/survey-titles.actions';

@Component({
  selector: 'pf-add-survey-title-modal',
  templateUrl: './add-survey-title-modal.component.html',
  styleUrls: ['./add-survey-title-modal.component.scss']
})

export class AddSurveyTitleModalComponent implements OnInit {
  @Input() surveyPublisherId;
  addSurveyTitleForm: FormGroup;
  private saveSurveyTitleSuccess$: Observable<boolean>;

  constructor(private store: Store<fromSurveyLibraryReducer.State>,
              public state: SurveyLibraryStateService,
              private fb: FormBuilder) {
    this.addSurveyTitleForm = this.fb.group({
      'newSurveyName': [],
      'newSurveyCode': []
    });
    this.saveSurveyTitleSuccess$ = this.store.select(fromSurveyLibraryReducer.getSavingSurveyTitlesSuccess);
  }

  ngOnInit() {
    this.saveSurveyTitleSuccess$.subscribe(isSuccess => {
      if (isSuccess) {
        this.store.dispatch(new fromSurveyTitlesActions.LoadingSurveyTitles({
          publisherId: this.surveyPublisherId, filter: {SearchTerm: '', CompanyId: undefined}
        }));
        this.handleModalDismissed();
      }
    });
  }

  handleFormSubmit() {
    const request = {
      SurveyPublisherId: this.surveyPublisherId,
      SurveyName: this.addSurveyTitleForm.controls['newSurveyName'].value,
      SurveyCode: this.addSurveyTitleForm.controls['newSurveyCode'].value
    };
    this.store.dispatch(new fromSurveyTitlesActions.SaveSurveyTitle(request));
  }

  handleModalDismissed() {
    this.state.setAddSurveyTitleModalOpen(false);
  }
}
