import { SavedFilterType, SearchFilter, SavedFilterUpsertRequest } from 'libs/models/payfactors-api/';
import { SavedFilter } from 'libs/features/search/models';

import { ProjectSearchContext, JobContext } from '../models';

export class SavedFilterHelper {
  static isPayMarketDefaultFilter(savedFilter: SavedFilter, payMarketId: number): boolean {
    return savedFilter.MetaInfo.DefaultPayMarkets.some(dpmid => dpmid.toString() === payMarketId.toString());
  }

  static getUpsertRequest(id: string, name: string, filters?: SearchFilter[]): SavedFilterUpsertRequest {
    if (!!id) {
      return {
        Type: SavedFilterType.SurveySearch,
        SavedFilter: {
          Id: id,
          Name: name,
          MetaInfo: {
            DefaultPayMarkets: []
          }
        }
      };
    } else {
      return {
        Type: SavedFilterType.SurveySearch,
        SavedFilter: {
          Name: name,
          Filters: filters,
          MetaInfo: {
            DefaultPayMarkets: []
          }
        }
      };
    }
  }

  static getPayMarketId(jobContext: JobContext, projectSearchContext: ProjectSearchContext): number {
    return (!!jobContext && jobContext.JobPayMarketId) ||
      (!!projectSearchContext && projectSearchContext.PayMarketId);
  }

  static getDefaultFilter(payMarketId: number, savedFilters: SavedFilter[]): SavedFilter {
    return savedFilters.find(sf => sf.MetaInfo.DefaultPayMarkets
      .some(dpmid => dpmid.toString() === payMarketId.toString()));
  }
}
