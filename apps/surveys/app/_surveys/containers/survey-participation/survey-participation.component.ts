import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbAccordion, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import orderBy from 'lodash/orderBy';

import { SurveyInfoByCompanyDto } from 'libs/models/survey';
import { UserContext } from 'libs/models/security';
import { NotificationLevel, NotificationType } from 'libs/features/infrastructure/app-notifications';
import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';

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

  userContext$: Observable<UserContext>;

  userContextSubscription: Subscription;

  groupedSurveys: GroupResult[] | SurveyInfoByCompanyDto[];
  impersonatorId: number;

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
      this.groupedSurveys = groupBy(this.surveys, [{ field: 'SurveyPublisher' }]);
      this.groupedSurveys = orderBy(this.groupedSurveys, ['value', (x: GroupResult) => x.value.toLowerCase()], 'asc');
    }
    if (changes?.showSurveyParticipantModal?.currentValue) {
      this.surveysAccordion.collapseAll();
    }
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (!!uc) {
        this.impersonatorId = uc.ImpersonatorId;
      }
    });
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
}
