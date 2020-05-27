import {CompositeDataLoadSearchCriteria} from 'libs/models/admin/loader-dashboard/request';

import {GridSearchPayload} from '../models';

export class LoaderDashboardModelMappers {
  static mapGridSearchPayloadToSearchCriteria(x: GridSearchPayload): CompositeDataLoadSearchCriteria {
    return {
      StartDate: x.StartDate,
      EndDate: x.EndDate,
      ExcludeTestCompanies: x.ExcludeTestCompanies
    };
  }
}
