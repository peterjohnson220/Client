import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

export interface UserNotificationDisplay {
  Title: string;
  Message: string;
  IsRead: boolean;
  CreateDate: Date;
  BaseUrl: string;
  ButtonText: string;
  IconName: IconName;
  IconPrefix: IconPrefix;
  OpenLinkInNewTab: boolean;
}
