import { JobDescriptionViewConstants } from 'libs/features/job-description-management/constants';

export class JobDescriptionHelper {

  static isUserDefinedViewsAvailable(views: string[]): boolean {
    return views.length > JobDescriptionViewConstants.SYSTEM_VIEWS.length - 1;
  }

}
