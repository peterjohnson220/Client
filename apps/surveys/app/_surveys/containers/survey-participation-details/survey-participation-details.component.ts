import { Component, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { FileRestrictions, SelectEvent, SuccessEvent, UploadEvent } from '@progress/kendo-angular-upload';

import { NotificationLevel, NotificationType } from 'libs/features/infrastructure/app-notifications';
import { SurveyInfoByCompanyDto } from 'libs/models/survey';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';

import * as fromSurveysPageReducer from '../../reducers';
import * as fromSurveyParticipationActions from '../../actions/survey-participation.actions';

@Component({
  selector: 'pf-survey-participation-details',
  templateUrl: './survey-participation-details.component.html',
  styleUrls: ['./survey-participation-details.component.scss']
})
export class SurveyParticipationDetailsComponent implements OnDestroy {
  @Input() impersonatorId: number;
  @Input() survey: SurveyInfoByCompanyDto;

  uploadSurveyParticipationFileUrl = '/odata/CloudFiles.UploadSurveyParticipation';
  invalidFileTypeMessage: string;
  fileRestrictions: FileRestrictions = {
    allowedExtensions: ['.xls', '.xlsx', '.pdf', '.zip']
  };

  constructor(
    private store: Store<fromSurveysPageReducer.State>,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(new fromSurveyParticipationActions.ResetUploadStatus(this.survey.SurveyId));
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

  handleFileSelect(event: SelectEvent): void {
    const selectedFile = event?.files?.length ? event.files[0] : null;
    if (selectedFile) {
      const validationError = selectedFile.validationErrors?.length ? selectedFile.validationErrors[0] : '';
      this.invalidFileTypeMessage = validationError === 'invalidFileExtension'
        ? 'File type not valid.  File must be type xls, xlsx, pdf, or zip.'
        : null;
    }
  }

  handleUpload(event: UploadEvent): void {
    this.store.dispatch(new fromSurveyParticipationActions.UploadSurveyParticipationFile(this.survey));
  }

  handleUploadSuccess(event: SuccessEvent): void {
    if (!event?.files?.length) {
      return;
    }
    const updatedSurvey: SurveyInfoByCompanyDto = {
      SurveyId: this.survey.SurveyId,
      SurveyPublisher: this.survey.SurveyPublisher,
      SurveyTitle: this.survey.SurveyTitle,
      ParticipationFileName: event.files[0].name
    };
    this.store.dispatch(new fromSurveyParticipationActions.SaveSurveyParticipation(updatedSurvey));
  }

  handleUploadError(event: any): void {
    this.store.dispatch(new fromSurveyParticipationActions.UploadSurveyParticipationFileError(this.survey));
  }
}
