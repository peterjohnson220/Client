import { Injectable } from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { AppNotification, NotificationPayload, NotificationSource, ProgressStatusPayload } from './notification.model';
import { ReportBuilderMessageFormatter } from './report-builder-message-formatter.model';
import { GenericMessageFormatter } from './generic-message-formatter';

@Injectable()
export class NotificationHelper {

  constructor(private sanitizer: DomSanitizer) { }

  getEventMessage(notification: AppNotification<NotificationPayload>): string {
    let message = '';
    switch (notification.From) {
      case NotificationSource.GenericNotificationMessage: {
        message = GenericMessageFormatter.getEventMessage(notification.Level, notification.Payload);
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

    const progressBar = this.getProgressBar(notification.Payload.PercentageComplete);
    message = GenericMessageFormatter.getProgressMessage(notification.Payload.Message);
    message = message + progressBar;

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
