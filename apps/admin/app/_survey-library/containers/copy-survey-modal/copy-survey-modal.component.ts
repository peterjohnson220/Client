import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api';

import * as fromSurveysReducer from '../../reducers';
import * as fromSurveyActions from '../../actions/survey-actions';
import * as fromCompanySelectorActions from '../../actions/company-selector.actions';
import { CompanySelectorItem } from '../../models';

@Component({
  selector: 'pf-copy-survey-modal',
  templateUrl: './copy-survey-modal.component.html',
  styleUrls: ['./copy-survey-modal.component.scss']
})
export class CopySurveyModalComponent implements OnInit {


  @Input() SelectedSurveyCompany: string;
  @Input() surveyId: number;

  isModalOpen$: Observable<boolean>;
  companies: CompanySelectorItem[];
  selectedCompany: CompanySelectorItem = null;
  private companies$: Observable<CompanySelectorItem[]>;
  hasError = false;

  constructor(
    private surveyApi: SurveyLibraryApiService,
    private store: Store<fromSurveysReducer.State>
  ) {

    this.isModalOpen$ = this.store.select(fromSurveysReducer.isCopySurveyModalOpen);
    this.companies$ = store.select(fromSurveysReducer.getCompanies);
  }

  ngOnInit(): void {

    this.companies$.subscribe(companies => {
      if (companies) {
        this.companies = [{ CompanyId: null, CompanyName: 'Seed' }, ...companies];
        this.selectedCompany = this.companies.filter(x => x.CompanyName === this.SelectedSurveyCompany)[0];
      }
    },
      () => this.hasError = true
    );

    this.isModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.hasError = false;
        this.store.dispatch(new fromCompanySelectorActions.GetCompanies());
      }
    },
      () => this.hasError = true
    );
  }

  addSurvey() {
    this.surveyApi.copySurvey(this.surveyId, this.selectedCompany.CompanyId).subscribe(f =>
      this.handleModalDismissed()
      ,
      () => this.hasError = true
    );
  }

  handleModalDismissed() {
    this.hasError = false;
    this.selectedCompany = null;
    this.store.dispatch(new fromSurveyActions.ShouldRefreshGrid(true));
    this.store.dispatch(new fromSurveyActions.SetCopySurveyModalOpen(false));
  }
}
