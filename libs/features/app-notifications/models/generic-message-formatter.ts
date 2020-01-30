import escape from 'lodash';

import { NotificationLevel, NotificationPayload, NotificationWithFilePayload } from './notification.model';

export class GenericMessageFormatter {
    static getEventMessage(level: NotificationLevel, payload: NotificationPayload): string {
        const messagePayload = payload as NotificationWithFilePayload;
        let display: string;
        if (!messagePayload.Message || messagePayload.Message.length <= 0) {
            return ``;
        }
        display = `<div class="container">
                    <div class="row">
                        <div class="col-auto align-middle px-0">`;
        switch (level) {
            case NotificationLevel.Success: {
                display += `<div class='check-circle-icon ml-auto'></div>`;
                break;
            }
            case NotificationLevel.Error: {
                display += `<div class='text-danger alert-triangle-icon ml-auto' ></div>`;
                break;
            }
            default:
                break;
        }
        const shouldAddLink = (level === NotificationLevel.Success && messagePayload.FileDownloadLink.length > 0);
        display += `</div><div class="col pr-0 pl-2">`;
        if (shouldAddLink) {
            display += `<u><a href="${messagePayload.FileDownloadLink}">`;
        }
        display += escape(messagePayload.Message);
        if (shouldAddLink) {
            display += `</a></u>`;
        }
        display += `</div></div></div>`;
        return display;
    }
    static getProgressMessage(message: string): string {
        throw new Error('not implemented');
    }
}
