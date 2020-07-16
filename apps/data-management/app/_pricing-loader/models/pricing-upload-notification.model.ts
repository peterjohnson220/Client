import {
  AppNotification,
  NotificationPayload,
  NotificationLevel,
  NotificationSource,
  NotificationType
} from 'libs/features/app-notifications/models';

export interface PricingUploadNotification {
  Success: AppNotification<NotificationPayload>;
  ValidationOnly: AppNotification<NotificationPayload>;
  Error: AppNotification<NotificationPayload>;
}

export function buildPricingUploadNotification(): PricingUploadNotification {
  return {
    Success: {
      NotificationId: '',
      Level: NotificationLevel.Info,
      From: NotificationSource.GenericNotificationMessage,
      Payload: {
        Title: 'Pricing Loader',
        Message: 'File is being uploaded, you will receive an email when processing is complete.'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    },
    ValidationOnly: {
      NotificationId: '',
      Level: NotificationLevel.Info,
      From: NotificationSource.GenericNotificationMessage,
      Payload: {
        Title: 'Pricing Loader',
        Message: 'Your files will be validated. The results will be emailed and will include all records noting any record that would have been an error.'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    },
    Error: {
      NotificationId: '',
      Level: NotificationLevel.Error,
      From: NotificationSource.GenericNotificationMessage,
      Payload: {
        Title: 'Pricing Loader',
        Message: 'Your file upload failed. Please file a defect ticket in Jira.'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    }
  };
}
