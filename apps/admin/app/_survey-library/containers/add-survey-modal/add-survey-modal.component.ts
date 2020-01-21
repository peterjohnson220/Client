import { Component, Input, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';

import * as fromSurveysReducer from '../../reducers';
import * as fromSurveyActions from '../../actions/survey-actions';

@Component({
  selector: 'pf-add-survey-modal',
  templateUrl: './add-survey-modal.component.html',
  styleUrls: ['./add-survey-modal.component.scss']
})
export class AddSurveyModalComponent implements OnInit {

  @Input() public surveyYearId: number;

  isModalOpen$: Observable<boolean>;
  addSurveyForm: FormGroup;
  public showAgingAndCost = false;
  companies: any;
  isSubmitting = false;
  isGettingCompanies = false;

  constructor(
    private surveyApi: SurveyLibraryApiService,
    private store: Store<fromSurveysReducer.State>,
    private fb: FormBuilder) {

    this.addSurveyForm = this.fb.group({
      newCompany: [],
      newCost: [],
      newAging: []
    });

    this.isModalOpen$ = this.store.select(fromSurveysReducer.isAddSurveyModalOpen);
  }

  ngOnInit() {
    this.isModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.isSubmitting = false;
        this.showAgingAndCost = false;
        this.isGettingCompanies = true;
        this.surveyApi.getAddSurveyPopup(this.surveyYearId).subscribe(f => {
          this.companies = [{ CompanyId: '', CompanyName: 'Seed' }, ...f];
          this.addSurveyForm.controls['newCompany'].setValue('');
          this.addSurveyForm.markAsTouched();
          this.isGettingCompanies = false;
        });
      } else {
        this.companies = [];
      }
    });
  }

  handleFormSubmit() {
    this.isSubmitting = true;
    this.surveyApi.saveSurvey(this.surveyYearId, this.addSurveyForm.get('newAging').value,
      this.getNewCompanyId(), this.addSurveyForm.get('newCost').value)
      .subscribe(() => {
        this.isSubmitting = false;
        this.handleModalDismissed();
      }
      );
  }

  getNewCompanyId(): number {
    // tslint:disable-next-line: radix
    return parseInt(this.addSurveyForm.get('newCompany').value);
  }

  getSelectedCompanyName() {
    const selectedCompanyId = this.getNewCompanyId();
    this.showAgingAndCost = !Number.isNaN(selectedCompanyId);
  }

  handleModalDismissed() {
    this.store.dispatch(new fromSurveyActions.ShouldRefreshGrid(true));
    this.store.dispatch(new fromSurveyActions.SetAddSurveyModalOpen(false));
  }
}
