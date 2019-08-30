import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { SurveyLibraryStateService } from '../../services/survey-library-state.service';

@Component({
  selector: 'pf-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  public surveyYearId: number;
  public pageTitle: string;
  public tbxSearch: string;
  public surveys: any;
  public surveyTitleId: number;


  constructor(
    private activeRoute: ActivatedRoute,
    private surveyApi: SurveyLibraryApiService,
    private state: SurveyLibraryStateService) {
    this.surveyYearId = activeRoute.snapshot.params.id;
  }

  ngOnInit() {
    this.surveyApi.getFirstSurveyByYearId(this.surveyYearId).subscribe(f => {
      const date = new Date(f.EffectiveDate);
      this.surveyTitleId = f.SurveyTitleId;
      this.pageTitle = f.SurveyPublisher + ' ' + f.SurveyName + ' ' +
        (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    );

    this.getSurveys();
  }

  getSurveys() {
    this.surveyApi.getSurveyList(this.surveyYearId, this.tbxSearch).subscribe(f =>
      this.surveys = f);
  }

  backToSurveyYear() {
    window.location.href = '/marketdata/admin/surveyyears.asp?surveytitle_id=' + this.surveyTitleId;
  }

  handleSearchChanged(filter: string) {
    this.getSurveys();
  }

  addSurvey() {
    this.state.setAddSurveyModalOpen(true);
  }
}
