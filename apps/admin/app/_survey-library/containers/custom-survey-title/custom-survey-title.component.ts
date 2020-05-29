import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';

import { SaveCustomCompanySurveyTitleRequestModel } from 'libs/models/payfactors-api/survey-library/request';

import { SurveyTitleCompanyModel } from '../../models';
import * as fromSurveyLibraryReducer from '../../reducers';
import * as fromCustomSurveyTitleActions from '../../actions/survey-titles.actions';

@Component({
  selector: 'pf-custom-survey-title',
  templateUrl: './custom-survey-title.component.html',
  styleUrls: ['./custom-survey-title.component.scss']
})

export class CustomSurveyTitleComponent implements OnInit {
  @ViewChild('surveyTitleInput') surveyTitleInput: ElementRef;
  @Input() SurveyTitleCompany: SurveyTitleCompanyModel;
  @Input() SurveyTitleId: number;

  labelOnly: boolean;
  newSurveyTitle: string;
  private savedInfo$: Observable<any>;

  constructor(private store: Store<fromSurveyLibraryReducer.State>) {
    this.labelOnly = true;
    this.savedInfo$ = store.select(fromSurveyLibraryReducer.getSavedCustomTitleInfo);
  }

  ngOnInit(): void {
    this.newSurveyTitle = this.SurveyTitleCompany.CustomSurveyName;

    this.savedInfo$.subscribe(obj => {
      if (this.SurveyTitleCompany.CompanyId === obj.companyId && this.SurveyTitleId === obj.titleId) {
        this.store.dispatch(new fromCustomSurveyTitleActions.SaveCustomTitleSuccess(null, null));
        this.SurveyTitleCompany.CustomSurveyName = this.newSurveyTitle;
        this.switchView();
      }
    });
  }

  focus() {
    this.surveyTitleInput.nativeElement.focus();
  }

  switchView() {
    this.labelOnly = !this.labelOnly;
  }

  saveCustomSurveyTitle() {
    if (this.newSurveyTitle !== this.SurveyTitleCompany.CustomSurveyName) {
      const request: SaveCustomCompanySurveyTitleRequestModel = {
        CompanyId: this.SurveyTitleCompany.CompanyId,
        CustomSurveyName: this.newSurveyTitle
      };
      this.store.dispatch(new fromCustomSurveyTitleActions.SaveCustomTitle({ surveyTitleId: this.SurveyTitleId, request: request }));
    } else {
      this.switchView();
    }
  }
}
