import { Component, OnInit, Input } from '@angular/core';
import { Observable, of, observable, BehaviorSubject } from 'rxjs';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SurveyLibraryStateService } from '../../services/survey-library-state.service';

@Component({
  selector: 'pf-add-survey-modal',
  templateUrl: './add-survey-modal.component.html',
  styleUrls: ['./add-survey-modal.component.scss']
})
export class AddSurveyModalComponent implements OnInit {

  @Input() public surveyYearId: number;

  constructor(
    private surveyApi: SurveyLibraryApiService,
    public state: SurveyLibraryStateService,
    private fb: FormBuilder) {

    this.addSurveyForm = this.fb.group({
      'newCompany': [],
      'newCost': [],
      'newAging': []
    });

  }

  isSaving$ = of(false);
  selectedCompanyId: number;
  selectedCost: number;
  selectedAging: number;
  addSurveyForm: FormGroup;

  handleFormSubmit() {
    this.surveyApi.saveSurvey(this.surveyYearId, '', this.selectedAging, this.selectedCompanyId, this.selectedCost)
      .subscribe(f =>
        this.handleModalDismissed()
      );
  }
  handleModalDismissed() {
    this.state.setAddSurveyModalOpen(false);
  }

  ngOnInit() {
  }

}
