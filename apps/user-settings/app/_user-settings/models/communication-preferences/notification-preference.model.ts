export interface NotificationPreference {
  UserId: number;
  CategoryLookupKey: string;
  GroupName: string;
  DisplayName: string;
  NotificationCategoryId: number;
  SendEmail: boolean;
  NotifyUser: boolean;
  EmailPreferenceDisabled: boolean;
  NotifyPreferenceDisabled: boolean;
  EmailDirty: boolean;
  NotifyDirty: boolean;
}
