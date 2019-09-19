export interface AppNotification {
  NotificationId: string;
  EnableHtml: boolean;
  From: string;
  Level: NotificationLevel;
  Type: string;
  Payload: NotificationPayload;
}

export enum NotificationLevel {
  Info = 'Info',
  Success = 'Success',
  Warning = 'Info',
  Error = 'Error'
}

export enum NotificationType {
  Event = 'Event',
  Progress = 'Progress'
}

export interface NotificationPayload {
  Title: string;
  Message: string;
}
