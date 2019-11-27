import { JobDescriptionViewConstants } from '../../shared/constants';

export class JobDescriptionHelper {

  static isUserDefinedViewsAvailable(views: string[]): boolean {
    return views.length > JobDescriptionViewConstants.SYSTEM_VIEWS.length - 1;
  }

}
