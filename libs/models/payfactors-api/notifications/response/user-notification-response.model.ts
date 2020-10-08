export interface UserNotificationResponse {
  Id: number;
  UserId: number;
  NotificationId?: string;
  NotificationCategoryId: number;
  NotificationLevel: string;
  Title: string;
  Message: string;
  EnableHtml: boolean;
  IsRead: boolean;
  IsSeen: boolean;
  ShowBadge: boolean;
  CreateDate: Date;
  BaseUrl: string;
}
