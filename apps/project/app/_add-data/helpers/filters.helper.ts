import { Filter, MultiSelectFilter, MultiSelectOption, TextFilter } from '../models';

import { arraySortByString, SortDirection } from 'libs/core/functions';

// TODO [BC]: This code is very simlar to the code in: libs/features/peer/map/helpers/filter-sidebar.helper.ts
// Work on merging the peer model with this new more general model. And consolidate these functions
export function mergeClientWithServerFilters(clientFilters: MultiSelectFilter[], serverFilters: MultiSelectFilter[]) {

  let mergedFilters: MultiSelectFilter[] = [];

  if (clientFilters.length) {

    mergedFilters = serverFilters.map(sf => {

      let clientFilterOptionsWithCountReplaced = [];

      const clientFilterMatchedWithServer = clientFilters.find(cf => cf.Id === sf.Id);

      if (!!clientFilterMatchedWithServer) {
        clientFilterOptionsWithCountReplaced = clientFilterMatchedWithServer.Options
          .filter(o => o.Selected)
          .map(o => {
            const optionFromServer = sf.Options.find(a => a.Value === o.Value);
            o.Count = optionFromServer ? optionFromServer.Count : 0;

            return o;
          });
      }

      sf.Options = clientFilterOptionsWithCountReplaced
        .concat(sf.Options.filter(o => !clientFilterOptionsWithCountReplaced.some(cfo => cfo.Value === o.Value)));

      sortOptions(sf.Options);

      return sf;
    });
  } else {
    mergedFilters = serverFilters;
  }

  return mergedFilters;
}

function sortOptions(options: MultiSelectOption[]) {
  options.sort((a, b) => {
    return b.Count - a.Count || arraySortByString(a.Name, b.Name, SortDirection.Ascending);
  });
}
