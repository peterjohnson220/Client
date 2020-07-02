import { Injectable } from '@angular/core';

import { SurveySearchRequest } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { Filter, ResultsPagingOptions } from 'libs/features/search/models';

import {ModifyPricingsSearchContext, ProjectSearchContext} from '../models';

interface LatestDataFromStoreForSearchRequest {
  Filters: Filter[];
  PagingOptions: ResultsPagingOptions;
  ProjectSearchContext: ProjectSearchContext;
  ModifyPricingsSearchContext: ModifyPricingsSearchContext;
}

@Injectable()
export class PayfactorsSurveySearchApiHelper {

  constructor(
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper
  ) {}

  buildSurveySearchRequest(data: LatestDataFromStoreForSearchRequest): SurveySearchRequest {
    const pagingOptions = this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.PagingOptions);

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
