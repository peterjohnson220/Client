import { MultiSelectFilter, MultiSelectOption } from '../models';

import { arraySortByString, SortDirection } from 'libs/core/functions';

const maxNumberOfOptions = 5;

export interface MergeFiltersParams {
  clientFilters: MultiSelectFilter[];
  serverFilters: MultiSelectFilter[];
  keepFilteredOutOptions: boolean;
}

export function mergeClientWithServerFilters(param: MergeFiltersParams) {

  let mergedFilters: MultiSelectFilter[];

  // No need to merge unless we have client filters to work with, just take server filters
  if (param.clientFilters.length) {

    mergedFilters = param.serverFilters.map(sf => {
      const matchedClientFilter = param.clientFilters.find(cf => cf.Id === sf.Id);

      sf.Options = mergeClientAndServerOptions(sf, matchedClientFilter);

      if (param.keepFilteredOutOptions && sf.Options.length < maxNumberOfOptions) {
        sf.Options = fillOptionsWithUnselectedClientOptions(sf.Options, matchedClientFilter.Options);
      }

      sortOptions(sf.Options);

      return sf;
    });
  } else {
    mergedFilters = param.serverFilters;
  }

  return mergedFilters;
}


function mergeClientAndServerOptions(serverFilter: MultiSelectFilter, clientFilter: MultiSelectFilter) {
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

// Fill in the remainder option spots with current unselected client options
function fillOptionsWithUnselectedClientOptions(mergedOptions: MultiSelectOption[], clientOptions: MultiSelectOption[]) {
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

function sortOptions(options: MultiSelectOption[]) {
  options.sort((a, b) => {
    return b.Count - a.Count || arraySortByString(a.Name, b.Name, SortDirection.Ascending);
  });
}



