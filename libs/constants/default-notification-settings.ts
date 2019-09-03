import { NotificationSettings } from '@progress/kendo-angular-notification';

export class DefaultNotificationSettings {

    private static base: NotificationSettings = {
        animation: {
            type: 'slide',
            duration: 400,
        },
        closable: false,
        content: '',
        cssClass: '',
        hideAfter: 10000,
        position: {
            horizontal: 'center',
            vertical: 'top',
        },
        type: {
            style: 'none',
            icon: false,
        },
    };

    public static error: NotificationSettings = {
        ...DefaultNotificationSettings.base,
        content: 'We encountered an error. Please try refreshing your page.',
        type: {
            style: 'error',
            icon: false,
        },
    };

    public static success: NotificationSettings = {
        ...DefaultNotificationSettings.base,
        content: 'Success!',
        type: {
            style: 'success',
            icon: false,
        },
    };
}
