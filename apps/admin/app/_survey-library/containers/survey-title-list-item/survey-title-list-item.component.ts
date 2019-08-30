import { Component, Input } from '@angular/core';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';


import { SurveyTitleCompanyModel, SurveyTitleResponseModel } from '../../models';

@Component({
  selector: 'pf-survey-title-list-item',
  templateUrl: './survey-title-list-item.component.html',
  styleUrls: ['./survey-title-list-item.component.scss']
})

export class SurveyTitleListItemComponent {
  @Input() SurveyTitle: SurveyTitleResponseModel;
  isCollapsed: boolean;
  surveyTitleCompanies: SurveyTitleCompanyModel[];
  isLoading: boolean;

  constructor (private surveyLibraryApi: SurveyLibraryApiService) {
    this.isCollapsed = true;
  }


  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;

    if (!this.isCollapsed) {
      this.isLoading = true;
      this.surveyLibraryApi.getSurveyTitleCompanies(this.SurveyTitle.SurveyTitleId).subscribe(result => {
        this.surveyTitleCompanies = result;
        this.isLoading = false;
      });
    }
  }
}
