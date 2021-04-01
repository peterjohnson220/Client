import { NotificationLevel, NotificationPayload, SuccessStatusPayLoad, NotificationPayloadFileType } from './notification.model';

export class ReportBuilderMessageFormatter {

  static getEventMessage(level: NotificationLevel, payload: NotificationPayload): string {
    switch (level) {
      case NotificationLevel.Info: {
        const icon = this.getIconDiv(payload);
        let markup = `<div class="message-container">${icon}${payload.Message}</div>`;
        if (payload.SecondaryMessage) {
          markup += `<p class="text-muted secondary-message">${payload.SecondaryMessage}</p>`;
        }
        return markup;
      }
      case NotificationLevel.Success: {
        const successPayload = payload as SuccessStatusPayLoad;
        const icon = this.getIconDiv(payload);
        return `
          <a class="message-container w-100" href="${successPayload.ExportedViewLink}">
            ${icon}
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

  static getIconDiv(payload: NotificationPayload): string {
    switch (payload.FileType) {
      case NotificationPayloadFileType.Pdf:
        return '<div class="file-pdf-icon mr-3"></div>';
      case NotificationPayloadFileType.Email:
        return '<div class="envelope-icon mr-3"></div>';
      case NotificationPayloadFileType.Docx:
        return '<div class="word-icon mr-3"></div>';
      default: {
        return '<div class="file-excel-icon mr-3"></div>';
      }
    }
  }

}
