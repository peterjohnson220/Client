import {
  isRangeFilter,
  FilterableMultiSelectFilter,
  FilterableMultiSelectOption,
  MultiSelectFilter,
  MultiSelectOption,
  RangeFilter
} from '../models';
import * as cloneDeep from 'lodash.clonedeep';

export interface MultiSelectFiltersMergeParams {
  clientFilters: MultiSelectFilter[];
  serverFilters: MultiSelectFilter[];
  keepFilteredOutOptions: boolean;
}

export interface FilterableMultiSelectFiltersMergeParams {
  clientFilters: FilterableMultiSelectFilter[];
  serverFilters: FilterableMultiSelectFilter[];
  subFilters: MultiSelectFilter[];
  keepFilteredOutOptions: boolean;
}

export interface SingleFilterMergeParams {
  singledFilter: MultiSelectFilter;
  subFilters: MultiSelectFilter[];
}

export interface RangeFiltersMergeParams {
  clientFilters: RangeFilter[];
  serverFilters: RangeFilter[];
}

export class ClientServerFilterHelper {
  static defaultNumberOfOptions = 5;

  static mergeClientWithServerMultiSelectFilters(param: MultiSelectFiltersMergeParams) {

    let mergedFilters: MultiSelectFilter[];

    // No need to merge unless we have client filters to work with, just take server filters
    if (param.clientFilters.length) {

      mergedFilters = param.serverFilters.map(sf => {
        const matchedClientFilter = param.clientFilters.find(cf => cf.Id === sf.Id);

        if (!!matchedClientFilter) {
          sf.Options = this.mergeClientAndServerOptions(sf, matchedClientFilter);
          const overriddenMaxNumberOfOptions = sf.AggregateCount == null ? this.defaultNumberOfOptions : sf.AggregateCount;
          if (param.keepFilteredOutOptions && sf.Options.length < overriddenMaxNumberOfOptions) {
            sf.Options = this.fillOptionsWithUnselectedClientOptions(sf.Options, matchedClientFilter.Options, overriddenMaxNumberOfOptions);
          }
        }

        return sf;
      });
    } else {
      mergedFilters = param.serverFilters;
    }

    return mergedFilters;
  }

  static mergeNewFiltersWithSingleFilter(param: SingleFilterMergeParams) {
    let mergedSingleFilter: FilterableMultiSelectFilter;

    if (param.singledFilter) {
      const subFilter = param.subFilters.filter(f => f.ParentBackingField === param.singledFilter.BackingField)[0];
      if (!subFilter) { return; }
      mergedSingleFilter = cloneDeep(param.singledFilter);
      mergedSingleFilter.Options.forEach(o => {
        o.SelectionsCount = subFilter.Options.filter( op => JSON.parse(op.Value).ParentOptionValue === o.Value && op.Selected).length;
      });
    }

    return mergedSingleFilter;
  }

  static mergeClientWithServerFilterableMultiSelectFilters(param: FilterableMultiSelectFiltersMergeParams) {
    let mergedFilters: FilterableMultiSelectFilter[];

    if (param.clientFilters.length) {
      mergedFilters = param.serverFilters.map(sf => {
        const matchedClientFilter = param.clientFilters.find(cf => cf.Id === sf.Id);

        if (!!matchedClientFilter) {
          sf.Options = this.mergeClientAndServerFilterableOptions(sf, matchedClientFilter);
          const overriddenMaxNumberOfOptions = sf.AggregateCount == null ? this.defaultNumberOfOptions : sf.AggregateCount;
          if (param.keepFilteredOutOptions && sf.Options.length < overriddenMaxNumberOfOptions) {
            sf.Options = this.fillOptionsWithUnselectedClientFilterableOptions(sf.Options, matchedClientFilter.Options,
              overriddenMaxNumberOfOptions); // update for filterable options.....
          }
        }
        return sf;
      });
    } else {
      mergedFilters = param.serverFilters;
    }

    mergedFilters.forEach(f => {
      const subFilter = param.subFilters.filter(fil => fil.ParentBackingField === f.BackingField)[0];

      if (subFilter) {
        f.Options.forEach(o => {
          o.SelectionsCount = subFilter.Options.filter( op => JSON.parse(op.Value).ParentOptionValue === o.Value && op.Selected).length;
        });
      }

    });

    return mergedFilters;
  }

  static mergeClientWithServerRangeFilters(param: RangeFiltersMergeParams) {
    let mergedFilters: RangeFilter[];
    if (param.clientFilters.length) {
      mergedFilters = param.serverFilters.filter(f => isRangeFilter(f)).map(sf => {
        const matchedClientFilter = param.clientFilters.find(cf => cf.Id === sf.Id);
        if (!!matchedClientFilter) {
          sf.SelectedMaxValue = matchedClientFilter.SelectedMaxValue;
          sf.SelectedMinValue = matchedClientFilter.SelectedMinValue;
        }

        return sf;
      });
    } else {
      mergedFilters = param.serverFilters;
    }
    return mergedFilters;
  }

  static mergeClientAndServerOptions(serverFilter: MultiSelectFilter, clientFilter: MultiSelectFilter) {
    let mergedOptions: MultiSelectOption[];

    // Re-populate current selections onto server options
    mergedOptions = serverFilter.Options.map(sfo => {
      const matchedClientOptionIndex = clientFilter.Options.findIndex(cfo => cfo.Value === sfo.Value);

      if (matchedClientOptionIndex >= 0) {
        // Set selected to what it currently was
        sfo.Selected = clientFilter.Options[matchedClientOptionIndex].Selected;

        // Remove it from the current client filters
        clientFilter.Options.splice(matchedClientOptionIndex, 1);
      }

      return sfo;
    });

    // Add Remaining selected options
    mergedOptions = mergedOptions.concat(clientFilter.Options.filter(o => o.Selected).map(o => {
      o.Count = 0;
      return o;
    }));

    return mergedOptions;
  }

  static mergeClientAndServerFilterableOptions(serverFilter: FilterableMultiSelectFilter, clientFilter: FilterableMultiSelectFilter) {
    let mergedOptions: FilterableMultiSelectOption[];

    mergedOptions = serverFilter.Options.map(sfo => {
      const matchedClientOptionIndex = clientFilter.Options.findIndex(cfo => cfo.Value === sfo.Value);

      if (matchedClientOptionIndex >= 0) {
        // Set selected to what it currently was
        sfo.Selected = clientFilter.Options[matchedClientOptionIndex].Selected;

        // Remove it from the current client filters
        clientFilter.Options.splice(matchedClientOptionIndex, 1);
      }

      return sfo;
    });
    // Add Remaining selected options
    mergedOptions = mergedOptions.concat(clientFilter.Options.filter(o => o.Selected).map(o => {
      o.Count = 0;
      return o;
    }));

    return mergedOptions;
  }

  static removeNonSelectedMultiSelectFilterOptionsToMatchAggregateCount(multiSelectFilter: MultiSelectFilter) {
    const selectedOptions = multiSelectFilter.Options.filter(o => o.Selected || (o as FilterableMultiSelectOption)?.SelectionsCount > 0);
    const nonSelectedOptions = multiSelectFilter.Options.filter(o => !o.Selected && (!!!(o as FilterableMultiSelectOption).SelectionsCount || (o as FilterableMultiSelectOption)?.SelectionsCount === 0));
    if (selectedOptions.length >= multiSelectFilter.AggregateCount) {
      multiSelectFilter.Options = selectedOptions;
      return;
    }
    const newOptions = selectedOptions.concat(nonSelectedOptions);
    newOptions.length = multiSelectFilter.AggregateCount;
    multiSelectFilter.Options = newOptions.sort((a, b) => b.Count - a.Count);
  }

  // Fill in the remainder option spots with current unselected client options
  private static fillOptionsWithUnselectedClientOptions(mergedOptions: MultiSelectOption[],
                                                        clientOptions: MultiSelectOption[],
                                                        maxNumberOfOptions: number) {
    return mergedOptions.concat(
      clientOptions
        .filter(o => !o.Selected)
        .splice(0, maxNumberOfOptions - mergedOptions.length)
        .map(o => {
          o.Count = 0;
          return o;
        })
    );
  }

  private static fillOptionsWithUnselectedClientFilterableOptions(mergedOptions: FilterableMultiSelectOption[],
                                                                  clientOptions: FilterableMultiSelectOption[],
                                                                  maxNumberOfOptions: number) {
    return mergedOptions.concat(
      clientOptions
        .filter(o => !o.Selected)
        .splice(0, maxNumberOfOptions - mergedOptions.length)
        .map(o => {
          o.Count = 0;
          return o;
        })
    );
  }
}

