import { SearchField, SearchFilter, SearchRequest } from 'libs/models/survey-search';

import { Filter, ProjectSearchContext, ResultsPagingOptions } from '../models';
import { FiltersHelper } from './filters.helper';
import { PayfactorsApiModelMapper } from './payfactors-api-model-mapper.helper';

interface LatestDataFromStoreForSearchRequest {
  Filters: Filter[];
  PagingOptions: ResultsPagingOptions;
  ProjectSearchContext: ProjectSearchContext;
}

export class PayfactorsApiHelper {

  static buildSurveySearchRequest(data: LatestDataFromStoreForSearchRequest): SearchRequest {
    const pagingOptions = PayfactorsApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.PagingOptions);

    return {
      SearchFields: this.getTextFiltersWithValuesAsSearchFields(data.Filters),
      Filters: this.getSelectedFiltersAsSearchFilters(data.Filters),
      FilterOptions: { ReturnFilters: pagingOptions.From === 0, AggregateCount: 5 },
      PagingOptions: pagingOptions,
      CurrencyCode: data.ProjectSearchContext.CurrencyCode,
      CountryCode: data.ProjectSearchContext.CountryCode,
      ProjectId: data.ProjectSearchContext.ProjectId
    };
  }

  static getSelectedFiltersAsSearchFilters(filters: Filter[]): SearchFilter[] {
    const multiSelects = PayfactorsApiModelMapper.mapMultiSelectFiltersToSearchFilters(
      FiltersHelper.getMultiSelectFiltersWithSelections(filters));
    const rangeFilters = PayfactorsApiModelMapper.mapRangeFiltersToSearchFilters(
      FiltersHelper.getRangeFiltersWithSelections(filters));


    return multiSelects.concat(rangeFilters);
  }

  static getTextFiltersWithValuesAsSearchFields(filters: Filter[]): SearchField[] {
    return PayfactorsApiModelMapper.mapFiltersToSearchFields(FiltersHelper.getTextFiltersWithValues(filters));
  }
}
