import * as isEqual from 'lodash.isequal';

import {
  Filter,
  FilterableMultiSelectFilter,
  Filters,
  FilterType,
  isFilterableMultiFilter,
  isMultiFilter,
  isRangeFilter,
  isTextFilter,
  MultiSelectFilter,
  MultiSelectOption,
  RangeFilter,
  TextFilter
} from '../models';

export class FiltersHelper {
  static multiSelectToNotRefresh = f => isMultiFilter(f) && (!f.RefreshOptionsFromServer || f.Locked);
  static filterToNotRefresh = f => isTextFilter(f) || FiltersHelper.multiSelectToNotRefresh(f);

  static clearFilters(filters: Filter[]): Filter[] {
    return filters.map(f => this.clearFilter(f) );
  }

  static clearFilter(filter: Filter, optionValue?: any): Filter {
    if ((isMultiFilter(filter) || isFilterableMultiFilter(filter)) && !filter.Locked) {
      if (!optionValue) {
        filter.Options.map(o => o.Selected = false);
      } else {
        filter.Options.find(o => isEqual(o.Value, optionValue)).Selected = false;
      }
    } else if (isRangeFilter(filter)) {
      filter.SelectedMaxValue = null;
      filter.SelectedMinValue = null;
    } else if (isTextFilter(filter)) {
      filter.Value = '';
    }
    return filter;
  }

  static clearFilterWithParentOptionValue(filter: Filter, parentOptionValue: string): Filter {
    if ((isFilterableMultiFilter(filter) || isMultiFilter(filter)) && !filter.Locked) {
      filter.Options.filter(o => JSON.parse(o.Value).ParentOptionValue === parentOptionValue).forEach(x => x.Selected = false );
    }
    return filter;
  }

  static applyDefaults(filters: Filter[]): Filter[] {
    return filters.map(f => this.applyDefault(f) );
  }

  static applyDefault(filter: Filter): Filter {
    if (isTextFilter(filter)) {
      const textFilter = filter as TextFilter;
      if (textFilter.DefaultValue) {
        filter.Value = textFilter.DefaultValue;
      }
    } else if (isMultiFilter(filter)) {
      const multiFilter = filter as MultiSelectFilter;
      if (multiFilter.DefaultSelections && multiFilter.DefaultSelections.length) {
        filter.Options.map(o => o.Selected = multiFilter.DefaultSelections.some(d => isEqual(d, o.Value)));
      }
    }

    return filter;
  }

  static hasDefault(filter: Filters): boolean {
    let hasDefault = false;

    switch (filter.Type) {
      case FilterType.Multi: {
        hasDefault = filter.DefaultSelections.length > 0;
        break;
      }
      case FilterType.Text: {
        hasDefault = filter.DefaultValue.length > 0;
        break;
      }
      case FilterType.Range: {
        hasDefault = false;
      }
    }

    return hasDefault;
  }

  static getFiltersWithValues(filters: Filter[]): Filter[] {
    return filters.filter((filter: Filters) => {
      let hasValue = false;

      switch (filter.Type) {
        case FilterType.Multi: {
          hasValue = filter.Options.some(o => o.Selected);
          break;
        }
        case FilterType.FilterableMulti: {
          hasValue = filter.Options.some(o => o.Selected);
          break;
        }
        case FilterType.Text: {
          hasValue = filter.Value.length > 0;
          break;
        }
        case FilterType.Range: {
          hasValue = (filter.MaximumValue !== filter.SelectedMaxValue || filter.MinimumValue !== filter.SelectedMinValue)
            && (filter.SelectedMinValue != null && filter.SelectedMaxValue != null);
        }
      }

      return hasValue;
    });
  }

  static getTextFiltersWithValues(filters: Filter[]) {
    return filters.filter(f => isTextFilter(f) && f.Value);
  }

  static getMultiSelectFiltersWithSelections(filters: Filter[]): MultiSelectFilter[] {
    return <MultiSelectFilter[]>filters.filter(f => isMultiFilter(f) && f.Options.some(o => o.Selected));
  }

  static getFilterableMultiSelectFiltersWithSelections(filters: Filter[]): FilterableMultiSelectFilter[] {
    return <FilterableMultiSelectFilter[]>filters.filter(f => isFilterableMultiFilter(f) && f.Options.some(o => o.Selected));
  }

  static getMultiSelectFilterSelectedOptions(multiSelectFilter: MultiSelectFilter): MultiSelectOption[] {
    return multiSelectFilter.Options.filter(o => o.Selected);
  }

  static getRangeFiltersWithSelections(filters: Filter[]): RangeFilter[] {
    return <RangeFilter[]>filters.filter(f => isRangeFilter(f) &&
      (f.MaximumValue !== f.SelectedMaxValue || f.MinimumValue !== f.SelectedMinValue) &&
      (f.SelectedMinValue != null && f.SelectedMaxValue != null));
  }

  static selectAll(filters: Filter[]): Filter[] {
    filters.map((filter: Filter) => {
      if (isMultiFilter(filter)) {
        (filter as MultiSelectFilter).Options.map(o => o.Selected = true);
      }
      if (isRangeFilter(filter)) {
        (filter as RangeFilter).SelectedMinValue = filter.MinimumValue;
        (filter as RangeFilter).SelectedMaxValue = filter.MaximumValue;
      }
    });

    return filters;
  }

  static getNonSavedFilters(filters: Filter[]): Filter[] {
    return filters.filter(f =>
      isTextFilter(f) ||
      f.Locked ||
      (!isRangeFilter(f) && f.SaveDisabled));
  }
}

