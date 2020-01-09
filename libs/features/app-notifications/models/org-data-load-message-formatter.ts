import { NotificationLevel, NotificationPayload, SuccessStatusPayLoad } from './notification.model';

export class OrgDataLoadMessageFormatter {
    static getEventMessage(level: NotificationLevel, payload: NotificationPayload): string {

        const successPayload = payload as NotificationPayload;
        let display: string;
        display = `
                <div class="container">
                    <div class="row">
                        <div class="col-auto align-middle px-0">`;

        switch (level) {
            case NotificationLevel.Success: {
                display += `<div class='check-circle-icon ml-auto'></div>`;
                break;
            }
            case NotificationLevel.Error: {
                display += `<div class='text-danger alert-triangle-icon ml-auto' > </div>`;
                break;
            }

            default:
                break;
        }

        display += `</div>
            <div class="col pr-0 pl-2"> ${ successPayload.Message} </div>
            </div>
            </div>
              `;

        return display;
    }
    static getProgressMessage(message: string): string {
        throw new Error('not implemented');
    }
}
