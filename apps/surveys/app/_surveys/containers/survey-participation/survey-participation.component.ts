import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbAccordion, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { groupBy, GroupResult } from '@progress/kendo-data-query';

import { SurveyInfoByCompanyDto } from 'libs/models/survey';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';
import { InputDebounceComponent } from 'libs/forms/components/input-debounce';
import { AsyncStateObj } from 'libs/models/state';

import * as fromSurveysPageReducer from '../../reducers';
import * as fromSurveyParticipationActions from '../../actions/survey-participation.actions';

@Component({
  selector: 'pf-survey-participation',
  templateUrl: './survey-participation.component.html',
  styleUrls: ['./survey-participation.component.scss'],
  providers: [NgbAccordionConfig]
})
export class SurveyParticipationComponent implements OnInit, OnDestroy {
  @ViewChild('surveysAccordion') surveysAccordion: NgbAccordion;
  @ViewChild(InputDebounceComponent, { static: true }) public inputDebounceComponent: InputDebounceComponent;

  surveyInfo$: Observable<AsyncStateObj<SurveyInfoByCompanyDto[]>>;
  userContext$: Observable<UserContext>;
  modalOpen$: Observable<boolean>;

  surveyInfoSubscription: Subscription;
  userContextSubscription: Subscription;
  modalOpenSubscription: Subscription;

  originalGroupedSurveys: GroupResult[] | SurveyInfoByCompanyDto[];
  filteredGroupedSurveys: GroupResult[] | SurveyInfoByCompanyDto[];
  impersonatorId: number;
  searchValue: string;
  surveys: SurveyInfoByCompanyDto[];

  constructor(
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromSurveysPageReducer.State>,
    config: NgbAccordionConfig
  ) {
    config.type = 'white';
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.surveyInfo$ = this.store.select(fromSurveysPageReducer.getSurveyInfo);
    this.modalOpen$ = this.store.select(fromSurveysPageReducer.getSurveyParticipationModalOpen);
  }

  ngOnInit() {
    this.surveyInfoSubscription = this.surveyInfo$.subscribe(asyncObj => {
      if (!asyncObj?.loading && asyncObj?.obj?.length) {
        this.surveys = asyncObj.obj;
        this.originalGroupedSurveys = groupBy(this.surveys, [{ field: 'SurveyPublisher' }]);
        this.applySearchFilterList();
      }
    });
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (!!uc) {
        this.impersonatorId = uc.ImpersonatorId;
      }
    });
    this.modalOpenSubscription = this.modalOpen$.subscribe(isOpen => {
      if (!isOpen) {
        this.searchValue = '';
        this.inputDebounceComponent.clearValue();
        this.applySearchFilterList();
        this.collapseAllPanels();
      }
    });
  }

  ngOnDestroy(): void {
    this.surveyInfoSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.modalOpenSubscription.unsubscribe();
  }

  handleSurveyParticipationDismissed(): void {
    this.store.dispatch(new fromSurveyParticipationActions.CloseSurveyParticipationModal());
  }

  handleSearchValueChanged(value: string): void {
    this.searchValue = value.toLowerCase();
    this.applySearchFilterList();
    this.collapseAllPanels();
  }

  trackByPublisher(index: number) {
    return index;
  }

  trackBySurveyTitle(index: number, surveyInfo: SurveyInfoByCompanyDto) {
    return surveyInfo.SurveyId;
  }

  private applySearchFilterList(): void {
    if (!!this.searchValue && !!this.searchValue.length) {
      const filteredOptions = this.surveys
        .filter(s => s.SurveyName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1 ||
          s.SurveyPublisher.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1);
      this.filteredGroupedSurveys = groupBy(filteredOptions, [{ field: 'SurveyPublisher' }]);
    } else {
      this.filteredGroupedSurveys = this.originalGroupedSurveys;
    }
  }

  private collapseAllPanels(): void {
    if (this.surveysAccordion) {
      this.surveysAccordion.collapseAll();
    }
  }
}
