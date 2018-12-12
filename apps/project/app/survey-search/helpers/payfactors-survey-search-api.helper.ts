import { SearchRequest } from 'libs/models/payfactors-api/survey-search';
import { PayfactorsSearchApiHelper } from 'libs/features/search/helpers';
import { Filter, ResultsPagingOptions } from 'libs/features/search/models';

import { ProjectSearchContext } from '../models';
import { PayfactorsSurveySearchApiModelMapper } from './payfactors-survey-search-api-model-mapper.helper';
import { Injectable } from '@angular/core';

interface LatestDataFromStoreForSearchRequest {
  Filters: Filter[];
  PagingOptions: ResultsPagingOptions;
  ProjectSearchContext: ProjectSearchContext;
}

@Injectable()
export class PayfactorsSurveySearchApiHelper {

  constructor(private payfactorsSearchApiHelper: PayfactorsSearchApiHelper) {}

  buildSurveySearchRequest(data: LatestDataFromStoreForSearchRequest): SearchRequest {
    const pagingOptions = PayfactorsSurveySearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.PagingOptions);

    return {
      SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.Filters),
      Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.Filters),
      FilterOptions: { ReturnFilters: pagingOptions.From === 0, AggregateCount: 5 },
      PagingOptions: pagingOptions,
      CurrencyCode: data.ProjectSearchContext.CurrencyCode,
      CountryCode: data.ProjectSearchContext.CountryCode,
      ProjectId: data.ProjectSearchContext.ProjectId
    };
  }
}
