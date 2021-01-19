export interface UserSubscription {
  UserSubscriptionId: number;
  SubscriptionType: number;
  SubscriptionTypeName: string;
  Subscribed: boolean;
  UserId: number;
  Dirty: boolean;
}
