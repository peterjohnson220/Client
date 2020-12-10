import { NotificationPreferenceDto } from 'libs/models/notifications/notification-preference-dto.model';

import { NotificationPreference } from '../models/communication-preferences';

export class NotificationPreferenceDtoToPreferenceMapper {
  static mapPreferenceDtoToPreference(preferenceDto: NotificationPreferenceDto): NotificationPreference {
    return {
      ...preferenceDto,
      EmailDirty: false,
      NotifyDirty: false
    };
  }
}
