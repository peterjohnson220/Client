import { Injectable } from '@angular/core';

import { SearchField, SearchFilter } from 'libs/models/payfactors-api';

import { Filter } from '../models';
import { FiltersHelper } from './filters.helper';
import { PayfactorsSearchApiModelMapper } from './payfactors-search-api-model-mapper.helper';

@Injectable()
export class PayfactorsSearchApiHelper {

  constructor(private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper) { }

  getSelectedFiltersAsSearchFilters(filters: Filter[]): SearchFilter[] {
    const multiSelects = this.payfactorsSearchApiModelMapper.mapMultiSelectFiltersToSearchFilters(
      FiltersHelper.getMultiSelectFiltersWithSelections(filters));
    const rangeFilters = this.payfactorsSearchApiModelMapper.mapRangeFiltersToSearchFilters(
      FiltersHelper.getRangeFiltersWithSelections(filters));
    const filterableMultiSelects = this.payfactorsSearchApiModelMapper.mapFilterableMultiSelectFiltersToSearchFilters(
      FiltersHelper.getFilterableMultiSelectFiltersWithSelections(filters));
    const filtersWithAggCounts = this.payfactorsSearchApiModelMapper.mapMultiSelectFiltersToSearchFilters(
      FiltersHelper.getFiltersWithAggregateCountsAndNoSelections(filters));
    const filterableMultiSelectsWithAggCounts = this.payfactorsSearchApiModelMapper.mapFilterableMultiSelectFiltersToSearchFilters(
      FiltersHelper.getFilterableMultiSelectFiltersWithAggregateCountsAndNoSelections(filters));

    return multiSelects.concat(filterableMultiSelects).concat(rangeFilters).concat(filtersWithAggCounts).concat(filterableMultiSelectsWithAggCounts);
  }

  getTextFiltersWithValuesAsSearchFields(filters: Filter[]): SearchField[] {
    return this.payfactorsSearchApiModelMapper.mapFiltersToSearchFields(FiltersHelper.getTextFiltersWithValues(filters));
  }
}
