import { Component, Input } from '@angular/core';

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

  toggleJobDetails(): void {
    this.showJobDetails = !this.showJobDetails;
    this.buttonText = this.showJobDetails ? 'Hide Job Detail' : 'Show Job Detail';
  }
}
