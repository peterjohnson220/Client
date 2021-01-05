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

  getSelectedFilterValues(filters: Filter[], backingField: string): any[] {
    const filter = filters.find(sf => sf.BackingField === backingField);
    const filtersWithSelections = this.getSelectedFiltersAsSearchFilters([filter]);
    if (!filter || !filtersWithSelections?.length || !filtersWithSelections[0].Options?.length) {
      return [];
    }

    return filtersWithSelections[0].Options.map(o => o.Value);
  }

  getTextFiltersWithValuesAsSearchFields(filters: Filter[]): SearchField[] {
    return this.payfactorsSearchApiModelMapper.mapFiltersToSearchFields(FiltersHelper.getTextFiltersWithValues(filters));
  }

  sliceSearchFiltersOptions(filters: SearchFilter[], requestedFilters: SearchFilter[], count: number): SearchFilter[] {
    return filters.map(filter => {
      if (!filter || !filter.Options || filter.Options.length < count) {
        return filter;
      }
      let options = [];
      const requestedFilter = requestedFilters?.find(x => x.Name === filter.Name);
      if (requestedFilter) {
        // always add selected options into the filter
        options = filter.Options.filter(x => requestedFilter.Options.some(o => o.Name === x.Name));
      }
      if (options.length < count) {
        // add remaining options up to requested count
        options = options.concat(filter.Options
                                .filter(f => !options.some(x => x === f))
                                .slice(0, count - options.length));
      }
      return {
        ...filter,
        Options: options.sort((a, b) => b.Count - a.Count)
      };
    });
  }
}
