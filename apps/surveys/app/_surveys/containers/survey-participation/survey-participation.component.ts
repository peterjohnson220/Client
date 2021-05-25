import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbAccordion, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { SurveyInfoByCompanyDto } from 'libs/models/survey';
import { UserContext } from 'libs/models/security';
import { NotificationLevel, NotificationType } from 'libs/features/infrastructure/app-notifications';
import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { InputDebounceComponent } from 'libs/forms/components/input-debounce';

@Component({
  selector: 'pf-survey-participation',
  templateUrl: './survey-participation.component.html',
  styleUrls: ['./survey-participation.component.scss'],
  providers: [NgbAccordionConfig]
})
export class SurveyParticipationComponent implements OnInit, OnChanges {
  @Input() surveys: SurveyInfoByCompanyDto[];
  @Input() showSurveyParticipantModal: boolean;

  @ViewChild('surveysAccordion') surveysAccordion: NgbAccordion;
  @ViewChild(InputDebounceComponent, { static: true }) public inputDebounceComponent: InputDebounceComponent;

  userContext$: Observable<UserContext>;

  userContextSubscription: Subscription;

  originalGroupedSurveys: GroupResult[] | SurveyInfoByCompanyDto[];
  filteredGroupedSurveys: GroupResult[] | SurveyInfoByCompanyDto[];

  impersonatorId: number;
  searchValue: string;

  constructor(
    private rootStore: Store<fromRootState.State>,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>,
    config: NgbAccordionConfig
  ) {
    config.type = 'white';
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.surveys?.currentValue) {
      this.filteredGroupedSurveys = groupBy(this.surveys, [{ field: 'SurveyPublisher' }]);
      this.originalGroupedSurveys = cloneDeep( this.filteredGroupedSurveys);
    }
    if (changes?.showSurveyParticipantModal?.currentValue) {
      this.collapseAllPanels();
    } else {
      this.searchValue = '';
      this.inputDebounceComponent.clearValue();
    }
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (!!uc) {
        this.impersonatorId = uc.ImpersonatorId;
      }
    });
  }

  handleSearchValueChanged(value: string): void {
    this.searchValue = value.toLowerCase();
    this.applySearchFilterList();
  }

  trackByPublisher(index: number) {
    return index;
  }

  trackBySurveyTitle(index: number, surveyInfo: SurveyInfoByCompanyDto) {
    return surveyInfo.SurveyId;
  }

  downloadSurveyParticipationFile(fileName: string): void {
    const formattedFileName = encodeURIComponent(fileName);
    const notification = {
      NotificationId: '',
      Level: NotificationLevel.Success,
      From: 'Survey Participation',
      Payload: {
        Title: 'File Ready',
        Message: `Download: ${fileName}`,
        ExportedViewLink: `/odata/CloudFiles.GetSurveyParticipationFile?FileName=${formattedFileName}`
      },
      EnableHtml: true,
      Type: NotificationType.Event
    };

    this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(notification));
  }
  private applySearchFilterList(): void {
    if (!!this.searchValue && !!this.searchValue.length) {
      const filteredOptions = this.surveys
        .filter(s => s.SurveyTitle.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1 ||
          s.SurveyPublisher.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1);
      this.filteredGroupedSurveys = groupBy(filteredOptions, [{ field: 'SurveyPublisher' }]);
    } else {
      this.filteredGroupedSurveys = this.originalGroupedSurveys;
      this.collapseAllPanels();
    }
  }

  private collapseAllPanels(): void {
    if (this.surveysAccordion) {
      this.surveysAccordion.collapseAll();
    }
  }
}
