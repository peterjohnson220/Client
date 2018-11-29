import * as cloneDeep from 'lodash.clonedeep';
import * as isEqual from 'lodash.isequal';

import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import { staticFilters } from '../data';
import { Filter, FilterType, isMultiFilter, isRangeFilter, isTextFilter, MultiSelectFilter, TextFilter } from '../models';
import { ClientServerFilterHelper, FiltersHelper, PayfactorsApiModelMapper } from '../helpers';

const multiSelectToNotRefresh = f => isMultiFilter(f) && (!f.RefreshOptionsFromServer || f.Locked);
const filterToNotRefresh = f => isTextFilter(f) || multiSelectToNotRefresh(f);

export interface State {
  filters: Filter[];
  loadingDefaultSurveyScopes: boolean;
}

const initialState: State = {
  filters: staticFilters,
  loadingDefaultSurveyScopes: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchFiltersActions.Actions): State {
  switch (action.type) {
    case fromSearchFiltersActions.REMOVE_FILTERS: {
      return {
        ...state,
        filters: initialState.filters
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
    case fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER: {
      return {
        ...state,
        loadingDefaultSurveyScopes: true
      };
    }
    case fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS: {
      let filters = state.filters;

      if (action.payload.Options.length) {
        filters = cloneDeep(state.filters);
        const defaultScopeFilter = <MultiSelectFilter>PayfactorsApiModelMapper.mapSearchFilterToFilter(cloneDeep(action.payload));
        defaultScopeFilter.Options.map(o => o.Selected = true);
        defaultScopeFilter.DefaultSelections = defaultScopeFilter.Options.map(o => o.Value);
        defaultScopeFilter.ShowAllOptions = true;
        filters.push(defaultScopeFilter);
      }

      return {
        ...state,
        filters: filters,
        loadingDefaultSurveyScopes: false
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
    case fromSearchFiltersActions.REFRESH_FILTERS: {
      const clientFilters = cloneDeep(state.filters);
      const clientFiltersNotBeingRefreshed = clientFilters.filter(filterToNotRefresh);
      const serverFilters = cloneDeep(action.payload.searchFilters);

      const newMultiSelectFilters = ClientServerFilterHelper.mergeClientWithServerMultiSelectFilters(
        {
          serverFilters: serverFilters.filter(f => isMultiFilter(f) && !clientFiltersNotBeingRefreshed.some(cf => cf.Id === f.Id)),
          clientFilters: clientFilters.filter(f => !filterToNotRefresh(f)),
          keepFilteredOutOptions: action.payload.keepFilteredOutOptions
        }
      );

      const newRangeFilters = ClientServerFilterHelper.mergeClientWithServerRangeFilters(
        {
          serverFilters: serverFilters.filter(f => isRangeFilter(f)),
          clientFilters: clientFilters.filter(f => isRangeFilter(f))
        }
      );

      const allFilters = clientFiltersNotBeingRefreshed.concat(newMultiSelectFilters).concat(newRangeFilters);

      allFilters.sort((a, b) => a.Order - b.Order);

      return {
        ...state,
        filters: allFilters
      };
    }
    case fromSearchFiltersActions.CLEAR_FILTER: {
      const copiedFilters = cloneDeep(state.filters);
      const filterToClear = copiedFilters.find(f => f.Id === action.payload.filterId);
      FiltersHelper.clearFilter(filterToClear);

      return {
        ...state,
        filters: copiedFilters
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
    case fromSearchFiltersActions.RESET_ALL_FILTERS: {
      let filters = FiltersHelper.clearFilters(cloneDeep(state.filters));
      filters = FiltersHelper.applyDefaults(filters);
      return {
        ...state,
        filters: filters
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
    case fromSearchFiltersActions.ADD_FILTERS: {
      const filtersCopy = cloneDeep(state.filters);

      action.payload.map(f => filtersCopy.push(f));

      return {
        ...state,
        filters: filtersCopy
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
    case fromSearchFiltersActions.APPLY_SAVED_FILTERS: {
      const filtersCopy = cloneDeep(state.filters);
      let savedFilters = cloneDeep(action.payload);

      // TODO [BC]: Move this logic out into a helper
      // Start with just text filters
      const newFilters = filtersCopy.filter(f => f.Type === FilterType.Text);

      // Keep any locked filters
      filtersCopy.filter(f => f.Locked).map(f => newFilters.push(f));

      // When we have non text filters that have system applied defaults override them only when they are present in the saved
      // filter. Otherwise re-apply all the defaults.
      const nonTextFiltersWithDefaults = filtersCopy.filter(f => f.Type !== FilterType.Text && FiltersHelper.hasDefault(f));
      nonTextFiltersWithDefaults.map(df => {
        const hasSavedFilter = savedFilters.some(sf => sf.Id === df.Id);

        if (hasSavedFilter) {
          const matchedSavedFilter = savedFilters.find(sf => sf.Id === df.Id);
          df.Options.map(o => o.Selected = matchedSavedFilter.Options.some(msf => isEqual(msf.Value, o.Value)));
          savedFilters = savedFilters.filter(sf => sf.Id !== df.Id);
        } else {
          FiltersHelper.applyDefault(df);
        }

        newFilters.push(df);
      });

      // Add saved filters
      savedFilters.map(sf => {
        // Handle range filters. Need to set the selections from the save min and max values.
        if (isRangeFilter(sf)) {
          sf.SelectedMinValue = sf.MinimumValue;
          sf.SelectedMaxValue = sf.MaximumValue;
          sf.MinimumValue = null;
          sf.MaximumValue = null;
        }

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
    default: {
      return state;
    }
  }
}

// Selector functions
export const getFilters = (state: State) => state.filters;
export const getLoadingDefaultSurveyScopes = (state: State) => state.loadingDefaultSurveyScopes;
