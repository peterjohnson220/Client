import { NotificationLevel, NotificationPayload, SuccessStatusPayLoad } from './notification.model';

export class ReportBuilderMessageFormatter {

  static getEventMessage(level: NotificationLevel, payload: NotificationPayload): string {
    switch (level) {
      case NotificationLevel.Info: {
        return `<div class="message-container"><div class="file-excel-icon mr-3"></div>${payload.Message}</div>`;
      }
      case NotificationLevel.Success: {
        const successPayload = payload as SuccessStatusPayLoad;
        return `
          <a class="message-container w-100" href="${successPayload.ExportedViewLink}">
            <div class='file-excel-icon mr-3'></div>
            ${successPayload.Message}
            <div class='check-circle-icon ml-auto'></div>
          </a>`;
      }
      default: {
        return payload.Message;
      }
    }
  }

  static getProgressMessage(message: string): string {
    return `<div class='message-container'>${message}</div>`;
  }

}
