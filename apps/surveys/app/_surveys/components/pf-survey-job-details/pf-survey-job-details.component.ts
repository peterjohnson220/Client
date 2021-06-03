import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { SurveyJobDetails } from 'libs/models/survey';

import * as fromSurveysPageActions from '../../actions/surveys-page.actions';
import * as fromSurveysPageReducer from '../../reducers';

@Component({
  selector: 'pf-survey-job-details',
  templateUrl: './pf-survey-job-details.component.html',
  styleUrls: ['./pf-survey-job-details.component.scss']
})
export class PfSurveyJobDetailsComponent implements OnInit, OnDestroy {

  @Input() surveyJobId: number;

  buttonText = 'Show Job Detail';
  showJobDetails = false;

  surveyJobDetailsList$: Observable<SurveyJobDetails[]>;

  surveyJobDetailsList: SurveyJobDetails[];
  surveyJobDetails: SurveyJobDetails;

  surveyJobDetailsSubscription: Subscription;

  constructor(
    private store: Store<fromSurveysPageReducer.State>
  ) {
    this.surveyJobDetailsList$ = this.store.select(fromSurveysPageReducer.getSurveyJobDetails);
  }

  ngOnInit(): void {
    this.surveyJobDetailsSubscription = this.surveyJobDetailsList$.subscribe(
      details => {
        this.surveyJobDetailsList = details;
        this.surveyJobDetails = this.surveyJobDetailsList.find(x => x.SurveyJobId === this.surveyJobId);

        if (!this.surveyJobDetails) {
          this.store.dispatch(new fromSurveysPageActions.GetSurveyJobDetails(this.surveyJobId));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.surveyJobDetailsSubscription.unsubscribe();
  }

  toggleJobDetails(): void {
    this.showJobDetails = !this.showJobDetails;
    this.buttonText = this.showJobDetails ? 'Hide Job Detail' : 'Show Job Detail';
  }
}
