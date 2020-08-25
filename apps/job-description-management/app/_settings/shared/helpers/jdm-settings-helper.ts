import { JobDescriptionViewConstants } from 'libs/features/job-description-management';

export class JdmSettingsHelper {
  static isSystemView(viewName: string) {
    return JobDescriptionViewConstants.SYSTEM_VIEWS.indexOf(viewName) > -1;
  }
}
