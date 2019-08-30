import { Component, Input} from '@angular/core';
import { SurveyTitleCompanyModel } from '../../models';

@Component({
  selector: 'pf-survey-title-companies-list',
  templateUrl: './survey-title-companies-list.component.html',
  styleUrls: ['./survey-title-companies-list.component.scss']
})

export class SurveyTitleCompaniesListComponent {
  @Input() SurveyTitleId: number;
  @Input() SurveyTitleCompanies: SurveyTitleCompanyModel[];

  constructor() { }
}
