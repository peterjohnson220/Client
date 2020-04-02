import { Injectable } from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { AppNotification, NotificationPayload, NotificationSource, ProgressStatusPayload } from './notification.model';
import { ReportBuilderMessageFormatter } from './report-builder-message-formatter.model';
import { ExchangeDataCutsMessageFormatter } from './exchange-data-cuts-message-formatter';
import { GenericMessageFormatter } from './generic-message-formatter';
import { JobDescriptionBulkExportFormatter } from './job-description-bulk-export-formatter';

@Injectable()
export class NotificationHelper {

  constructor(private sanitizer: DomSanitizer) { }

  getEventMessage(notification: AppNotification<NotificationPayload>): string {
    let message = '';
    switch (notification.From) {
      case NotificationSource.ExchangeDataCutsExport: {
        message = ExchangeDataCutsMessageFormatter.getEventMessage(notification.Level, notification.Payload);
        break;
      }
      case NotificationSource.GenericNotificationMessage: {
        message = GenericMessageFormatter.getEventMessage(notification.Level, notification.Payload);
        break;
      }
      case NotificationSource.JobDescriptionBulkExport: {
        message = JobDescriptionBulkExportFormatter.getEventMessage(notification.Level, notification.Payload);
        break;
      }
      case NotificationSource.JobDescriptionTemplatePublisher: {
        message = JobDescriptionBulkExportFormatter.getEventMessage(notification.Level, notification.Payload);
        break;
      }
      default: {
        message = ReportBuilderMessageFormatter.getEventMessage(notification.Level, notification.Payload);
        break;
      }
    }
    return message;
  }

  getProgressMessage(notification: AppNotification<ProgressStatusPayload>): SafeHtml {
    let message = notification.Payload.Message;
    switch (notification.From) {
      case NotificationSource.ExchangeDataCutsExport: {
        const progressBar = this.getProgressBar(notification.Payload.PercentageComplete);
        message = ExchangeDataCutsMessageFormatter.getProgressMessage(notification.Payload.Message);
        message = message + progressBar;
        break;
      }
      case NotificationSource.JobDescriptionBulkExport: {
        const progressBar = this.getProgressBar(notification.Payload.PercentageComplete);
        message = JobDescriptionBulkExportFormatter.getProgressMessage(notification.Payload.Message);
        message = message + progressBar;
        break;
      }
      case NotificationSource.JobDescriptionTemplatePublisher: {
        const progressBar = this.getProgressBar(notification.Payload.PercentageComplete);
        message = JobDescriptionBulkExportFormatter.getProgressMessage(notification.Payload.Message);
        message = message + progressBar;
        break;
      }
      default: {
        const progressBar = this.getProgressBar(notification.Payload.PercentageComplete);
        message = ReportBuilderMessageFormatter.getProgressMessage(notification.Payload.Message);
        message = message + progressBar;
        break;
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }

  private getProgressBar(percentage: number): string {
    let progressClasses = 'progress-bar-animated bg-info';
    if (percentage === 100) {
      progressClasses = 'bg-success';
    }
    const progressBar = `
      <div class="progress">
        <div class="progress-bar progress-bar-striped ${progressClasses}" role="progressbar"
        style="width: ${percentage}%">
        </div>
      </div>`;
    return progressBar;
  }
}
