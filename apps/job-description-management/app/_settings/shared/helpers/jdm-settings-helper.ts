import { JobDescriptionViewConstants } from '../../../shared/constants';

export class JdmSettingsHelper {
  static isSystemView(viewName: string) {
    return JobDescriptionViewConstants.SYSTEM_VIEWS.indexOf(viewName) > -1;
  }
}
