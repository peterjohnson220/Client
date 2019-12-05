import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

import { AppNotification, NotificationPayload, NotificationSource, ProgressStatusPayload } from './notification.model';
import { DataInsightsMessageFormatter } from './data-insights-message-formatter.model';
import { ExchangeDataCutsMessageFormatter } from './exchange-data-cuts-message-formatter';

@Injectable()
export class NotificationHelper {

  constructor(private sanitizer: DomSanitizer) {}

  getEventMessage(notification: AppNotification<NotificationPayload>): string {
    let message = '';
    switch (notification.From) {
      case NotificationSource.DataInsights: {
        message = DataInsightsMessageFormatter.getEventMessage(notification.Level, notification.Payload);
        break;
      }
      case NotificationSource.ExchangeDataCutsExport: {
        message = ExchangeDataCutsMessageFormatter.getEventMessage(notification.Level, notification.Payload);
        break;
      }
      default: {
        break;
      }
    }
    return message;
  }

  getProgressMessage(notification: AppNotification<ProgressStatusPayload>): SafeHtml {
    let message = notification.Payload.Message;
    switch (notification.From) {
      case NotificationSource.DataInsights: {
        const progressBar = this.getProgressBar(notification.Payload.PercentageComplete);
        message = DataInsightsMessageFormatter.getProgressMessage(notification.Payload.Message);
        message = message + progressBar;
        break;
      }
      case NotificationSource.ExchangeDataCutsExport: {
        const progressBar = this.getProgressBar(notification.Payload.PercentageComplete);
        message = ExchangeDataCutsMessageFormatter.getProgressMessage(notification.Payload.Message);
        message = message + progressBar;
        break;
      }
      default: {
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
