import {FilterableMultiSelectFilter, FilterableMultiSelectOption, isRangeFilter, MultiSelectFilter, MultiSelectOption, RangeFilter} from '../models';

export interface MultiSelectFiltersMergeParams {
  clientFilters: MultiSelectFilter[];
  serverFilters: MultiSelectFilter[];
  keepFilteredOutOptions: boolean;
}

export interface FilterableMultiSelectFiltersMergeParams {
  clientFilters: FilterableMultiSelectFilter[];
  serverFilters: FilterableMultiSelectFilter[];
  keepFilteredOutOptions: boolean;
}

export interface RangeFiltersMergeParams {
  clientFilters: RangeFilter[];
  serverFilters: RangeFilter[];
}

export class ClientServerFilterHelper {
  static maxNumberOfOptions = 5;

  static mergeClientWithServerMultiSelectFilters(param: MultiSelectFiltersMergeParams) {

    let mergedFilters: MultiSelectFilter[];

    // No need to merge unless we have client filters to work with, just take server filters
    if (param.clientFilters.length) {

      mergedFilters = param.serverFilters.map(sf => {
        const matchedClientFilter = param.clientFilters.find(cf => cf.Id === sf.Id);

        if (!!matchedClientFilter) {
          sf.Options = this.mergeClientAndServerOptions(sf, matchedClientFilter);

          if (param.keepFilteredOutOptions && sf.Options.length < this.maxNumberOfOptions) {
            sf.Options = this.fillOptionsWithUnselectedClientOptions(sf.Options, matchedClientFilter.Options);
          }
        }

        return sf;
      });
    } else {
      mergedFilters = param.serverFilters;
    }

    return mergedFilters;
  }

  static mergeClientWithServerFilterableMultiSelectFilters(param: FilterableMultiSelectFiltersMergeParams) {
    let mergedFilters: FilterableMultiSelectFilter[];

    if (param.clientFilters.length) {
      mergedFilters = param.serverFilters.map(sf => {
        const matchedClientFilter = param.clientFilters.find(cf => cf.Id === sf.Id);

        if (!!matchedClientFilter) {
          sf.Options = this.mergeClientAndServerFilterableOptions(sf, matchedClientFilter);

          if (param.keepFilteredOutOptions && sf.Options.length < this.maxNumberOfOptions) {
            sf.Options = this.fillOptionsWithUnselectedClientFilterableOptions(sf.Options, matchedClientFilter.Options); // update for filterable options.....
          }
        }
        return sf;
      });
    } else {
      mergedFilters = param.serverFilters;
    }
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

  // Fill in the remainder option spots with current unselected client options
  private static fillOptionsWithUnselectedClientOptions(mergedOptions: MultiSelectOption[], clientOptions: MultiSelectOption[]) {
    return mergedOptions.concat(
      clientOptions
        .filter(o => !o.Selected)
        .splice(0, this.maxNumberOfOptions - mergedOptions.length)
        .map(o => {
          o.Count = 0;
          return o;
        })
    );
  }

  private static fillOptionsWithUnselectedClientFilterableOptions(mergedOptions: FilterableMultiSelectOption[], clientOptions: FilterableMultiSelectOption[]) {
    return mergedOptions.concat(
      clientOptions
        .filter(o => !o.Selected)
        .splice(0, this.maxNumberOfOptions - mergedOptions.length)
        .map(o => {
          o.Count = 0;
          return o;
        })
    );
  }
}

