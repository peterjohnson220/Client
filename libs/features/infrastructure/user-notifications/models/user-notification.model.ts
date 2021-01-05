export interface UserNotification {
  Id: number;
  UserId: number;
  NotificationId?: string;
  NotificationCategoryId: number;
  LookupKey: string;
  NotificationLevel: string;
  EnableHtml: boolean;
  IsRead: boolean;
  IsSeen: boolean;
  ShowBadge: boolean;
  CreateDate: Date;
  BaseUrl: string;
  MetaData: string;
}
