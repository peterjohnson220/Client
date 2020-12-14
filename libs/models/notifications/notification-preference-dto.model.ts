export interface NotificationPreferenceDto {
  UserId: number;
  CategoryLookupKey: string;
  DisplayName: string;
  GroupName: string;
  NotificationCategoryId: number;
  SendEmail: boolean;
  NotifyUser: boolean;
  EmailPreferenceDisabled: boolean;
  NotifyPreferenceDisabled: boolean;
}
