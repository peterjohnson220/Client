import { Injectable } from '@angular/core';

import { SurveySearchRequest } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import { Filter, ResultsPagingOptions } from 'libs/features/search/search/models';

import {PricingMatchDataSearchContext} from '../models';

interface LatestDataFromStoreForSearchRequest {
  Filters: Filter[];
  PagingOptions: ResultsPagingOptions;
  PricingMatchDataSearchContext: PricingMatchDataSearchContext;
}

@Injectable()
export class PayfactorsSurveySearchApiHelper {

  constructor(
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper
  ) {}

  buildSurveySearchRequest(data: LatestDataFromStoreForSearchRequest): SurveySearchRequest {
    if (!data.PricingMatchDataSearchContext) {
      return;
    }
    const pagingOptions = this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.PagingOptions);

    return {
      SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.Filters),
      Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.Filters),
      FilterOptions: { ReturnFilters: pagingOptions.From === 0, AggregateCount: 5 },
      PagingOptions: pagingOptions,
      CurrencyCode: data.PricingMatchDataSearchContext.CurrencyCode,
      CountryCode: data.PricingMatchDataSearchContext.CountryCode,
      Rate: data.PricingMatchDataSearchContext.Rate
    };
  }
}
