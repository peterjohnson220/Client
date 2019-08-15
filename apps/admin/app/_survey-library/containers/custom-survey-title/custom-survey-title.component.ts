import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SaveCustomCompanySurveyTitleRequestModel } from 'libs/models/payfactors-api/survey-library/request';

import { SurveyTitleCompanyModel } from '../../models';
import * as fromSurveyLibraryReducer from '../../reducers';
import * as fromCustomSurveyTitleActions from '../../actions';

@Component({
  selector: 'pf-custom-survey-title',
  templateUrl: './custom-survey-title.component.html',
  styleUrls: ['./custom-survey-title.component.scss']
})

export class CustomSurveyTitleComponent implements OnInit, OnDestroy{
  @ViewChild('surveyTitleInput', {static: false}) surveyTitleInput: ElementRef;
  @Input() SurveyTitleCompany: SurveyTitleCompanyModel;
  @Input() SurveyTitleId: number;

  labelOnly: boolean;
  newSurveyTitle: string;
  private customSurveyNameSaveSuccess$: Observable<boolean>;
  private subscription: Subscription;

  constructor(private store: Store<fromSurveyLibraryReducer.State>) {
    this.labelOnly = true;
    this.customSurveyNameSaveSuccess$ = store.select(fromSurveyLibraryReducer.getCustomSurveyTitleSavingSuccess);
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.newSurveyTitle = this.SurveyTitleCompany.CustomSurveyName;
  }

  focus() {
    this.surveyTitleInput.nativeElement.focus();
  }

  switchView() {
    this.labelOnly = !this.labelOnly;
  }

  private saveCustomSurveyTitle() {
    if (this.newSurveyTitle !== this.SurveyTitleCompany.CustomSurveyName) {
      const request: SaveCustomCompanySurveyTitleRequestModel = {
        CompanyId: this.SurveyTitleCompany.CompanyId,
        CustomSurveyName: this.newSurveyTitle
      };
      this.store.dispatch(new fromCustomSurveyTitleActions.SaveCustomTitle({surveyTitleId: this.SurveyTitleId, request: request}));

      this.subscription.add(
        this.customSurveyNameSaveSuccess$.subscribe(success => {
          if (success) {
            this.SurveyTitleCompany.CustomSurveyName = this.newSurveyTitle;
            this.subscription.unsubscribe();
            this.switchView();
          }
        })
      );
    } else {
      this.switchView();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
