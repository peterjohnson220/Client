import { Component, Input, OnInit } from '@angular/core';

import { copyTextToClipboard } from 'libs/core/functions';

import { SurveyJobDetails } from '../../models';

@Component({
  selector: 'pf-survey-job-details',
  templateUrl: './pf-survey-job-details.component.html',
  styleUrls: ['./pf-survey-job-details.component.scss']
})
export class PfSurveyJobDetailsComponent {

  @Input() surveyJobDetails: SurveyJobDetails;

  buttonText = 'Show Job Detail';
  showJobDetails = false;

  constructor() { }

  copyJobDescription(text: string): void {
    copyTextToClipboard(text);
  }

  toggleJobDetails(): void {
    this.showJobDetails = !this.showJobDetails;
    this.buttonText = this.showJobDetails ? 'Hide Job Detail' : 'Show Job Detail';
  }
}
