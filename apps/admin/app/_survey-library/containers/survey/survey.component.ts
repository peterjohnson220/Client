import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import { UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import * as fromSurveyActions from '../../actions/survey-actions';
import * as fromSurveyState from '../../reducers';
import { EnumSurveyDelete } from '../../constants/survey-delete-enum';

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
  public userContext$: Observable<UserContext>;
  private shouldRefreshGrid$: Observable<boolean>;
  private surveyData$: Observable<any>;
  public isLoadingData$: Observable<boolean>;
  public hasLoadingError$: Observable<boolean>;
  public systemUserGroupsId = -1;
  public selectedSurveyId: number;
  public selectedCompany: string;
  public enumSurveyDelete = EnumSurveyDelete;
  public deleteFailed = false;
  public selectedItemMatchCount = 0;

  public loadingErrorMessage = 'Failed to get survey data';

  constructor(
    private activeRoute: ActivatedRoute,
    private surveyApi: SurveyLibraryApiService,
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromSurveyState.State>
  ) {
    this.surveyYearId = this.activeRoute.snapshot.params.id;
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.shouldRefreshGrid$ = this.store.select(fromSurveyState.shouldRefreshGrid);
    this.surveyData$ = this.store.select(fromSurveyState.getSurveyData);
    this.isLoadingData$ = this.store.select(fromSurveyState.isLoadingSurveyData);
    this.hasLoadingError$ = this.store.select(fromSurveyState.surveyLoadFailed);
  }

  ngOnInit() {
    this.surveyApi.getFirstSurveyByYearId(this.surveyYearId).subscribe(f => {
      const date = new Date(f.EffectiveDate);
      this.surveyTitleId = f.SurveyTitleId;
      this.pageTitle = f.SurveyPublisher + ' ' + f.SurveyName + ' ' +
        (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    );

    this.userContext$.subscribe(userContext => {
      this.systemUserGroupsId = userContext.CompanySystemUserGroupsId;
    });

    this.surveyData$.subscribe(f => {
      this.surveys = f;
    });

    this.shouldRefreshGrid$.subscribe(f => {
      if (f) {
        this.getSurveys();
      }
    });

    this.getSurveys();

  }

  isUserGroupOne(): boolean {
    // in case our usercontext isn't loaded yet don't give extra permissions
    if (this.systemUserGroupsId === -1) { return false; }
    return this.systemUserGroupsId === 1;
  }

  getSurveys() {
    this.store.dispatch(new fromSurveyActions.GetSurveys(this.surveyYearId, this.tbxSearch));
  }

  backToSurveyYear() {
    window.location.href = '/marketdata/admin/surveyyears.asp?surveytitle_id=' + this.surveyTitleId;
  }

  handleSearchChanged() {
    this.getSurveys();
  }

  addSurvey() {
    this.store.dispatch(new fromSurveyActions.SetAddSurveyModalOpen(true));
  }


  deleteSurvey(surveyId: number, step: EnumSurveyDelete) {

    this.selectedSurveyId = surveyId;

    let msg = '';
    switch (step) {
      case EnumSurveyDelete.PUBLISHED_MATCHES:
        this.store.dispatch(new fromSurveyActions.SetDeleteConfirmationModalOpen(true));
        return;
      case EnumSurveyDelete.SURVEY_DATA:
        msg = 'Are you sure you want to delete the associated jobs and cuts?';
        break;
      case EnumSurveyDelete.SURVEY:
        msg = 'Are you sure you want to delete this survey?';
        break;
      default:
        throw new Error('EnumSurveyDelete case not supported');
    }

    if (confirm(msg)) {
      this.surveyApi.deleteSurveyAndChildren(surveyId, step).subscribe(f =>
        this.getSurveys(), (err) => {
          this.deleteFailed = true;
          this.loadingErrorMessage = 'Failed to delete the survey or it\'s related records.';
        }
      );
    }
  }

  deletePublishedMatches(item: any) {
    this.selectedItemMatchCount = item.PublishMatchCount;
    this.selectedSurveyId = item.SurveyId;
    this.deleteSurvey(item.SurveyId, EnumSurveyDelete.PUBLISHED_MATCHES)
  }

  copySurvey(surveyId: number, company: string) {
    this.selectedSurveyId = surveyId;
    this.selectedCompany = company;
    this.store.dispatch(new fromSurveyActions.SetCopySurveyModalOpen(true));
  }

  public mapCompaniesClick(surveyId: number) {
    this.selectedSurveyId = surveyId;
    this.store.dispatch(new fromSurveyActions.GetMapCompaniesModalData(surveyId, ''));
    this.store.dispatch(new fromSurveyActions.SetMapCompaniesModalOpen(true));
  }
}
