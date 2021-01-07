import { UserTileDto } from 'libs/models/dashboard';
import { NotificationPreferenceDto } from 'libs/models/notifications/notification-preference-dto.model';
import { UserSubscriptionDto } from 'libs/models/payfactors-api/UserSubscriptionDto/user-subscription-dto.model';

import { UserTile, NotificationPreference, UserSubscription } from '../models';

export class PayfactorsApiModelMapper {
  static buildSaveDashboardPreferencesRequest(userTiles: UserTile[]): UserTileDto[] {
    return userTiles.map(ut => {
      return {
        UserTileId: ut.UserTileId,
        TileName: ut.Label,
        TileDisplayName: ut.Label,
        IconClass: '',
        Url: '',
        Sidebar: false,
        NgAppLink: false,
        SidebarNew: false,
        TileClassName: '',
        IconClassNew: '',
        MarketingEnabled: ut.MarketingEnabled,
        HideOnDashboard: ut.HideOnDashboard
      };
    });
  }

  static buildNotificationPreferencesRequest(notificationPreferences: NotificationPreference[]): NotificationPreferenceDto[] {
    return notificationPreferences.map(p => {
      return {
        UserId : p.UserId,
        CategoryLookupKey : p.CategoryLookupKey,
        DisplayName : p.DisplayName,
        GroupName : p.GroupName,
        NotificationCategoryId : p.NotificationCategoryId,
        SendEmail : p.SendEmail,
        NotifyUser: p.NotifyUser,
        EmailPreferenceDisabled: p.EmailPreferenceDisabled,
        NotifyPreferenceDisabled: p.NotifyPreferenceDisabled
      };
    });
  }

  static buildUserSubscriptionRequest(userSubscriptions: UserSubscription[]): UserSubscriptionDto[] {
    return userSubscriptions.map( s => {
      return {
        UserSubscriptionId: s.UserSubscriptionId,
        SubscriptionType: s.SubscriptionType,
        SubscriptionTypeName: s.SubscriptionTypeName,
        Subscribed: s.Subscribed,
        UserId: s.UserId
      };
    });
  }
}
