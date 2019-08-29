import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SurveyLibraryStateService } from '../../services/survey-library-state.service';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';

@Component({
  selector: 'pf-add-survey-title-modal',
  templateUrl: './add-survey-title-modal.component.html',
  styleUrls: ['./add-survey-title-modal.component.scss']
})

export class AddSurveyTitleModalComponent {
  @Input() surveyPublisherId;
  addSurveyTitleForm: FormGroup;

  constructor(private surveyApi: SurveyLibraryApiService,
              public state: SurveyLibraryStateService,
              private fb: FormBuilder) {
    this.addSurveyTitleForm = this.fb.group({
      'newSurveyName': [],
      'newSurveyCode': []
    });
  }

  handleFormSubmit() {
    const request = {
      SurveyPublisherId: this.surveyPublisherId,
      SurveyName: this.addSurveyTitleForm.controls['newSurveyName'].value,
      SurveyCode: this.addSurveyTitleForm.controls['newSurveyCode'].value
    };
    this.surveyApi.saveSurveyTitle(request).subscribe(success => {
      this.handleModalDismissed();
    });
  }

  handleModalDismissed() {
    this.state.setAddSurveyTitleModalOpen(false);
  }
}
