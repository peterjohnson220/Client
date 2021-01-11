import { UserSubscriptionDto } from 'libs/models/payfactors-api/UserSubscriptionDto/user-subscription-dto.model';

import { UserSubscription } from '../models/communication-preferences';

export class UserSubscriptionDtoToUserSubscriptionMapper {
  static mapUserSubscriptionDtoToUserSubscription(subscriptionDto: UserSubscriptionDto): UserSubscription {
    return {
      ...subscriptionDto,
      Dirty: false
    };
  }
}
