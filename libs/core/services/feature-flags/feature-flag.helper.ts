import { UserContext } from '../../../models/security';
import { FeatureFlagContext, FeatureFlagContextAttribute } from './feature-flag.service';

export class FeatureFlagHelper {
  static buildContext(userContext: UserContext): FeatureFlagContext {
    return {
      key: userContext.UserId,
      email: userContext.EmailAddress,
      attributes: this.buildAttributes(userContext)
    };
  }

  private static buildAttributes(userContext: UserContext): FeatureFlagContextAttribute {
    return {
      CompanyId: userContext.CompanyId.toString(),
      ClientType: userContext.ClientType
    };
  }
}
