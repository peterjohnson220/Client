export interface AppNotification<T> {
  NotificationId: string;
  EnableHtml: boolean;
  From: string;
  Level: NotificationLevel;
  Type: string;
  Payload: T;
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

export interface NotificationWithFilePayload extends NotificationPayload {
  FileDownloadLink: string;
}

export interface ProgressStatusPayload extends NotificationPayload {
  IsCompleted: boolean;
  PercentageComplete: number;
}

export interface SuccessStatusPayLoad extends NotificationPayload {
  ExportedViewLink: string;
}

export enum NotificationSource {
  DataInsights = 'Data Insights',
  ExchangeDataCutsExport = 'Exchange Data Cuts Exporter',
  GenericNotificationMessage = 'Generic Notification Message',
  JobDescriptionBulkExport = 'Job Description Bulk Exporter'
}
