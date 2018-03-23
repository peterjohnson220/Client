import * as cloneDeep from 'lodash.clonedeep';

import { FilterAggregateGroup, FilterAggregateItem } from 'libs/models/peer';
import { arraySortByString, SortDirection } from 'libs/core/functions';
import { AggregateSelectionInfo } from '../models';

export class FilterSidebarHelper {

  // How many items to have in the preview array
  static readonly previewCount: number = 5;

  // Convert filter the provided filter aggregate groups into a selection object to be passed as part the data search
  // filter model. Each aggregate group will become a property on the object that is an array of the selected items.
  static buildSelections(aggregateGroups: FilterAggregateGroup[]) {
    const selectionObj = {};

    aggregateGroups.map(ag => {
      selectionObj[ag.MetaData.FilterProp] = ag.Aggregates.filter(a => a.Selected).map(a => a.Item);
    });

    return selectionObj;
  }

  // Given a AggregateSelectionInfo object telling us which aggregate item in a specific aggregate group was selected
  // toggle the Selected property on both Filter Aggregate Items to be opposite of what it was.
  static toggleAggregateItemSelected(selectionInfo: AggregateSelectionInfo, aggregateGroups: FilterAggregateGroup[]) {
    const copiedAggGroups = cloneDeep(aggregateGroups);
    const aggGroup = copiedAggGroups.find(ag => ag.MetaData.FilterProp === selectionInfo.AggregateGroup);

    const aggItem = aggGroup.Aggregates.find(ai => ai.Item === selectionInfo.AggregateItem);
    const aggPreviewItem = aggGroup.AggregatesPreview.find(ai => ai.Item === selectionInfo.AggregateItem);

    aggItem.Selected = !aggItem.Selected;

    // Selected item may not be apart of the preview array
    if (aggPreviewItem) {
      aggPreviewItem.Selected = !aggPreviewItem.Selected;
    }

    this.buildAggregatesPreview(copiedAggGroups);

    return copiedAggGroups;
  }

  // Given the current aggregate groups on the client and the aggregate groups returned from the server, this function
  // will merge the two collections. Any selected current agggregrate items will remain and have their counts updated
  // from the server.
  static mergeServerAggregatesWithSelected(currentAggGroups: FilterAggregateGroup[], serverAggGroups: FilterAggregateGroup[]) {
    const copiedCurrentAggGroups = cloneDeep(currentAggGroups);
    const copiedServerAggGroups = cloneDeep(serverAggGroups);
    let mergedAggGroups: FilterAggregateGroup[] = [];

    if (currentAggGroups.length) {
      mergedAggGroups = copiedServerAggGroups.map(sag => {
        // For each current selected aggregate item replace the count with the new count for that item from the server
        // If that item does not come back from the server set the count to 0
        const currentAggGroupsWithCountReplaced = copiedCurrentAggGroups
          .find(cag => cag.MetaData.FilterProp === sag.MetaData.FilterProp).Aggregates
          .filter(a => a.Selected)
          .map(c => {
            const aggItemFromServer = sag.Aggregates.find(a => a.Item === c.Item);
            c.Count = aggItemFromServer ? aggItemFromServer.Count : 0;

            return c;
          });

        sag.Aggregates = currentAggGroupsWithCountReplaced
          .concat(sag.Aggregates.filter(sai => !currentAggGroupsWithCountReplaced.some(n => n.Item === sai.Item)));

        this.sortAggregateItems(sag.Aggregates);

        return sag;
      });
    } else {
      mergedAggGroups = copiedServerAggGroups;
    }

    this.buildAggregatesPreview(mergedAggGroups);

    return mergedAggGroups;
  }

  // Given a collection of filter aggregate groups wil set selected on all aggregate items for each group to false.
  static clearAllSelections(aggregateGroups: FilterAggregateGroup[]) {
    const copiedAggregateGroups = cloneDeep(aggregateGroups);

    copiedAggregateGroups.map(ag => {
      ag.Aggregates = ag.Aggregates.map(a => {
        a.Selected = false;

        return a;
      });

      return ag;
    });

    return copiedAggregateGroups;
  }

  // Give a collection for filter aggregate groups and a group identified (FilterProp), will set the selected property
  // for each aggregate item to false for the aggregate group provided.
  static clearGroupSelections(aggregateGroups: FilterAggregateGroup[], aggGroupFilterProp: string) {
    const copiedAggregateGroups = cloneDeep(aggregateGroups);

    const aggGroup = copiedAggregateGroups
      .find(ag => ag.MetaData.FilterProp === aggGroupFilterProp);

    aggGroup.Aggregates = aggGroup
      .Aggregates.map(a => {
        a.Selected = false;

        return a;
      });

    this.buildAggregatesPreview(copiedAggregateGroups);

    return copiedAggregateGroups;
  }


  // Given a collection of Filter Aggregate Items, will sort the array by count first and then by Item name
  private static sortAggregateItems(aggregateItems: FilterAggregateItem[]) {
    aggregateItems.sort((a, b) => {
      return b.Count - a.Count || arraySortByString(a.Item, b.Item, SortDirection.Ascending);
    });
  }

  // Helper function for building a "Preview" array of filter aggregate groups. This array will always contain
  // all selected aggregate groups. If the # of selected aggregate groups is less than the preview count
  // the remaining space in the array will be filled by the first n elements that are not selected.
  private static buildAggregatesPreview(aggGroups: FilterAggregateGroup[]) {

    for (let i = 0; i < aggGroups.length; i++) {
      const selectedFilterAggs = aggGroups[i].Aggregates.filter(x => x.Selected);
      let aggPreview: FilterAggregateItem[];

      if (selectedFilterAggs.length > this.previewCount) {
        aggPreview = selectedFilterAggs;
      } else {
        aggPreview = aggGroups[i].Aggregates.filter(x => !x.Selected)
          .slice(0, this.previewCount - selectedFilterAggs.length)
          .concat(selectedFilterAggs);
      }

      this.sortAggregateItems(aggPreview);

      // Break reference connections between preview and items collection
      aggGroups[i].AggregatesPreview = cloneDeep(aggPreview);
    }
  }
}
