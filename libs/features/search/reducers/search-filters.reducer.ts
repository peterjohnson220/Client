import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import { Filter, isFilterableMultiFilter, isMultiFilter, isRangeFilter, isTextFilter, MultiSelectFilter, TextFilter } from '../models';
import { ClientServerFilterHelper, FiltersHelper } from '../helpers';

export interface State {
  filters: Filter[];
}

const initialState: State = {
  filters: []
};

// Reducer function
export function reducer(state = initialState, action: fromSearchFiltersActions.Actions): State {
  switch (action.type) {
    case fromSearchFiltersActions.ADD_FILTERS: {
      const filtersCopy = cloneDeep(state.filters);

      action.payload.map(f => filtersCopy.push(f));

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.ADD_FILTER_AND_SELECT_ALL_OPTIONS: {
      let filters = state.filters;

      if (action.payload.Options.length) {
        filters = cloneDeep(state.filters);
        const defaultScopeFilter = cloneDeep(action.payload);
        defaultScopeFilter.Options.map(o => o.Selected = true);
        defaultScopeFilter.DefaultSelections = defaultScopeFilter.Options.map(o => o.Value);
        defaultScopeFilter.ShowAllOptions = true;
        filters.push(defaultScopeFilter);
      }

      return {
        ...state,
        filters: filters
      };
    }
    case fromSearchFiltersActions.APPLY_SAVED_FILTERS: {
      const filtersCopy = cloneDeep(state.filters);
      const savedFilters = cloneDeep(action.payload);
      const newFilters = FiltersHelper.getNonSavedFilters(filtersCopy);

      // Add saved filters
      savedFilters.map(sf => {
        const matchedFilter = filtersCopy.find(f => sf.Id === f.Id);
        if (!(matchedFilter && matchedFilter.Locked)) {
          newFilters.push(sf);
        }
      });

      return {
        ...state,
        filters: newFilters
      };
    }
    case fromSearchFiltersActions.CLEAR_FILTER: {
      const copiedFilters = cloneDeep(state.filters);
      const filterToClear = copiedFilters.find(f => f.Id === action.payload.filterId);
      if (action.payload.parentOptionValue) {
        FiltersHelper.clearFilterWithParentOptionValue(filterToClear, action.payload.parentOptionValue);
      } else {
        FiltersHelper.clearFilter(filterToClear);
      }
      return {
        ...state,
        filters: copiedFilters
      };
    }
    case fromSearchFiltersActions.CLEAR_FILTERS: {
      return {
        ...state,
        filters: FiltersHelper.clearFilters(cloneDeep(state.filters))
      };
    }
    case fromSearchFiltersActions.CLEAR_SAVED_FILTERS: {
      const filtersCopy = cloneDeep(state.filters);
      const savedFilters = cloneDeep(action.payload);
      filtersCopy.map(f => {
        const matchedFilter = savedFilters.find(sf => sf.Id === f.Id);
        if (matchedFilter) {
          f = FiltersHelper.clearFilter(f);
        }
      });
      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.REFRESH_FILTERS: {
      const clientFilters = cloneDeep(state.filters);
      const clientFiltersNotBeingRefreshed = clientFilters.filter(FiltersHelper.filterToNotRefresh);
      const serverFilters = cloneDeep(action.payload.filters);
      const singleFilter = cloneDeep(action.payload.singleFilter);

      const newMultiSelectFilters = ClientServerFilterHelper.mergeClientWithServerMultiSelectFilters(
        {
          serverFilters: serverFilters.filter(f => isMultiFilter(f) && !clientFiltersNotBeingRefreshed.some(cf => cf.Id === f.Id)),
          clientFilters: clientFilters.filter(f => !FiltersHelper.filterToNotRefresh(f)),
          keepFilteredOutOptions: action.payload.keepFilteredOutOptions
        }
      );

      const newRangeFilters = ClientServerFilterHelper.mergeClientWithServerRangeFilters(
        {
          serverFilters: serverFilters.filter(f => isRangeFilter(f)),
          clientFilters: clientFilters.filter(f => isRangeFilter(f))
        }
      );

      const newFilterableMultiSelectFilters = ClientServerFilterHelper.mergeClientWithServerFilterableMultiSelectFilters(
        {
          serverFilters: serverFilters.filter(f => isFilterableMultiFilter(f) && !clientFiltersNotBeingRefreshed.some(cf => cf.Id === f.Id)),
          clientFilters: clientFilters.filter(f => !FiltersHelper.filterToNotRefresh(f)),
          subFilters: newMultiSelectFilters.filter(f => f.ParentBackingField !== null),
          keepFilteredOutOptions: action.payload.keepFilteredOutOptions
        }
      );

      const newSingleFilter = ClientServerFilterHelper.mergeNewFiltersWithSingleFilter(
        {
          singledFilter: singleFilter,
          subFilters: newMultiSelectFilters.filter(f => f.ParentBackingField !== null && !f.IsChildWithoutParent)
        }
      );

      const allFilters = clientFiltersNotBeingRefreshed.concat(newMultiSelectFilters).concat(newRangeFilters).concat(newFilterableMultiSelectFilters);

      allFilters.sort((a, b) => a.Order - b.Order);

      return {
        ...state,
        filters: allFilters
      };
    }
    case fromSearchFiltersActions.RESET_ALL_FILTERS: {
      let filters = FiltersHelper.clearFilters(cloneDeep(state.filters));
      filters = FiltersHelper.applyDefaults(filters);
      return {
        ...state,
        filters: filters
      };
    }
    case fromSearchFiltersActions.REMOVE_FILTER_VALUE: {
      const copiedFilters = cloneDeep(state.filters);
      const filterToRemoveValueFrom = copiedFilters.find(f => f.Id === action.payload.filterId);
      FiltersHelper.clearFilter(filterToRemoveValueFrom, action.payload.value);

      return {
        ...state,
        filters: copiedFilters
      };
    }
    case fromSearchFiltersActions.REMOVE_FILTERS: {
      return {
        ...state,
        filters: initialState.filters
      };
    }
    case fromSearchFiltersActions.REPLACE_FILTERS: {
      const filtersCopy = cloneDeep(state.filters);

      action.payload.map(f => {
        const matchedFilterIndex = filtersCopy.findIndex(mf => mf.Id === f.Id);

        if (!!matchedFilterIndex) {
          filtersCopy[matchedFilterIndex] = f;
        } else {
          filtersCopy.push(f);
        }
      });

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.SET_DEFAULT_VALUE: {
      const filtersCopy = cloneDeep(state.filters);
      const filter = filtersCopy.find(f => f.Id === action.payload.filterId);
      if (isTextFilter(filter)) {
        const textFilter = filter as TextFilter;
        textFilter.DefaultValue = action.payload.value;
        FiltersHelper.applyDefault(textFilter);
      } else if (isMultiFilter(filter)) {
        const multiFilter = filter as MultiSelectFilter;
        multiFilter.DefaultSelections = action.payload.selections;
        FiltersHelper.applyDefault(multiFilter);
      }

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION: {
      const filtersCopy = cloneDeep(state.filters);
      const filterOption = filtersCopy
        .find(f => f.Id === action.payload.filterId).Options
        .find(o => isEqual(o.Value, action.payload.option.Value));

      if (filterOption) {
        filterOption.Selected = !filterOption.Selected;
      } else {
        filtersCopy.find(f => f.Id === action.payload.filterId)
          .Options.push({...action.payload.option, Selected: true});
      }

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.UPDATE_FILTER_VALUE: {
      const filtersCopy = cloneDeep(state.filters);
      filtersCopy.find(f => f.Id === action.payload.filterId).Value = action.payload.value;

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.UPDATE_RANGE_FILTER: {
      const filtersCopy = cloneDeep(state.filters);
      const rangeFilter = filtersCopy.find(f => f.Id === action.payload.filterId && isRangeFilter(f));
      rangeFilter.SelectedMinValue = action.payload.minValue;
      rangeFilter.SelectedMaxValue = action.payload.maxValue;

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.SHOW_MORE: {
      const filtersCopy = cloneDeep(state.filters);
      const showMoreFilter = filtersCopy.find(f => f.BackingField === action.payload.backingField);
      if (showMoreFilter.AggregateCount == null || showMoreFilter.AggregateCount === 0) {
        showMoreFilter.AggregateCount = 15;
      } else {
        showMoreFilter.AggregateCount += 10;
      }

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.SHOW_LESS: {
      const filtersCopy = cloneDeep(state.filters);
      const showLessFilter = filtersCopy.find(f => f.BackingField === action.payload.backingField);
      if (showLessFilter.AggregateCount != null && showLessFilter.AggregateCount !== 5) {
        showLessFilter.AggregateCount -= 10;

        if (isMultiFilter(showLessFilter) || isFilterableMultiFilter(showLessFilter)) {
          ClientServerFilterHelper.removeNonSelectedMultiSelectFilterOptionsToMatchAggregateCount(showLessFilter);
        }
      }

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.ADD_FILTER_OPTIONS: {
      const filtersCopy = cloneDeep(state.filters);
      const updateFilter = filtersCopy.find(f => f.BackingField === action.payload.backingField && (isMultiFilter(f) || isFilterableMultiFilter(f)));
      const serverOptions = cloneDeep(action.payload.newOptions);
      const clientOptions = updateFilter.Options;
      const newOptions = serverOptions.filter(nO => clientOptions.findIndex(o => o.Value === nO.Value) < 0);
      const finalOptions = clientOptions.concat(newOptions);

      updateFilter.Options = finalOptions.map(o => {
        o.Selected = action.payload.currentSelections.some(so => so.Value === o.Value);
        return o;
      }).sort((a, b) => b.Count - a.Count);

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.RESET: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getParentFilters = (state: State) => state.filters.filter(f => !f.ParentBackingField || !!f.IsChildWithoutParent);
export const getChildFilters = (state: State) => state.filters.filter(f => !!f.ParentBackingField && !f.IsChildWithoutParent);
export const getAllFilters = (state: State) => state.filters;
