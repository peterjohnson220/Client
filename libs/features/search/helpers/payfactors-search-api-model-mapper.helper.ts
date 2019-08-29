import { Injectable } from '@angular/core';

import { PagingOptions, SearchField, SearchFilter, SearchFilterOption } from 'libs/models/payfactors-api';
import { SearchSavedFilterResponse } from 'libs/models/payfactors-api/user-filter/response';
import { SavedFilter } from 'libs/features/user-filter/models';

import {
  Filter,
  FilterType,
  MultiSelectFilter,
  MultiSelectOption,
  RangeFilter,
  ResultsPagingOptions,
  TextFilter
} from '../models';

import { FiltersHelper } from './filters.helper';
import { SearchFilterMappingDataObj } from '../models';


@Injectable()
export class PayfactorsSearchApiModelMapper {

  constructor(private searchFilterMappingData: SearchFilterMappingDataObj) {}

  ///
  /// IN
  ///
   mapSearchFiltersToFilters(searchFilters: SearchFilter[], mappingDataObject: SearchFilterMappingDataObj = null): Filter[] {
    if (mappingDataObject !== null) {
      this.searchFilterMappingData = mappingDataObject;
    }
    return searchFilters.map(sf => this.mapSearchFilterToFilter(sf));
  }

   mapSearchFiltersToMultiSelectFilters(searchFilters: SearchFilter[]): MultiSelectFilter[] {
    return searchFilters.map(sf => this.mapSearchFilterToMultiFilter(sf));
  }

   mapSearchFilterToFilter(searchFilter: SearchFilter): Filter {
    switch (this.getMappingData(searchFilter.Name).Type) {
      case FilterType.Multi:
        return this.mapSearchFilterToMultiFilter(searchFilter);
      case FilterType.Range:
        return this.mapSearchFilterToRangeFilter(searchFilter);
      default:
        return null;
    }
  }

   mapSearchSavedFilterResponseToSavedFilter(surveySavedFilterResponse: SearchSavedFilterResponse[]): SavedFilter[] {
    return surveySavedFilterResponse.map(ssfr => {
      return {
        Id: ssfr.Id,
        Name: ssfr.Name,
        MetaInfo: ssfr.MetaInfo,
        Filters: FiltersHelper.selectAll(this.mapSearchFiltersToMultiSelectFilters(ssfr.Filters)),
        Selected: false
      };
    });
  }

   mapSearchFilterOptionsToMultiSelectOptions(sfo: SearchFilterOption[]): MultiSelectOption[] {
    return sfo.map((o: SearchFilterOption): MultiSelectOption => {
      return {
        Name: o.Name,
        Value: o.Value,
        Count: o.Count,
        Selected: false
      };
    });
  }

  ///
  /// OUT
  ///
   mapFiltersToSearchFields(filters: Filter[]): SearchField[] {
    return filters.map((f: TextFilter) => {
      return {
        Name: f.BackingField,
        Value: f.Value
      };
    });
  }

   mapRangeFiltersToSearchFilters(rangeFilters: RangeFilter[]): SearchFilter[] {
    return rangeFilters.map(rf => this.mapRangeFilterToSearchFilter(rf));
  }

   mapMultiSelectFiltersToSearchFilters(multiSelectFilters: MultiSelectFilter[]): SearchFilter[] {
    return multiSelectFilters.map(msf => this.mapMultiSelectFilterToSearchFilter(msf));
  }

  mapResultsPagingOptionsToPagingOptions(resultsPagingOptions: ResultsPagingOptions): PagingOptions {
    return {
      From: resultsPagingOptions.pageSize * (resultsPagingOptions.page - 1),
      Count: resultsPagingOptions.pageSize
    };
  }

  ///
  /// Private Methods
  ///

  private mapRangeFilterToSearchFilter(rangeFilter: RangeFilter): SearchFilter {
    return {
      Name: rangeFilter.BackingField,
      Options: [{
        Name: 'min',
        Value: rangeFilter.SelectedMinValue
      }, {
        Name: 'max',
        Value: rangeFilter.SelectedMaxValue
      }]
    };
  }

  private mapMultiSelectFilterToSearchFilter(filter: MultiSelectFilter): SearchFilter {
    return {
      Name: filter.BackingField,
      Options: this.mapMultiSelectOptionsToSearchFilterOptions(filter.Options)
    };
  }

  private mapMultiSelectOptionsToSearchFilterOptions(multiSelectOptions: MultiSelectOption[]): SearchFilterOption[] {
    return multiSelectOptions.filter(mso => mso.Selected).map(mso => {
      return {
        Name: mso.Name,
        Value: mso.Value
      };
    });
  }

  private mapSearchFilterToMultiFilter(searchFilter: SearchFilter): MultiSelectFilter {
    const mappingData = this.getMappingData(searchFilter.Name);
    return {
      Id: searchFilter.Name.split('_').join(''),
      BackingField: mappingData.BackingField,
      DisplayName: mappingData.DisplayName,
      Options: this.mapSearchFilterOptionsToMultiSelectOptions(searchFilter.Options),
      Type: FilterType.Multi,
      RefreshOptionsFromServer: mappingData.RefreshOptionsFromServer,
      Order: mappingData.Order,
      OptionCountDisabled: mappingData.OptionCountDisabled,
      CssClassName: mappingData.DisplayName.toLowerCase().replace(/[\s]/g, '-'),
      DefaultSelections: [],
      SaveDisabled: mappingData.SaveDisabled
    };
  }

  private mapSearchFilterToRangeFilter(searchFilter: SearchFilter): RangeFilter {
    const minValue = Number(this.getNumberValueFromSearchFilterOption(searchFilter.Options, 'min'));
    const maxValue = Number(this.getNumberValueFromSearchFilterOption(searchFilter.Options, 'max'));
    const precision = Number(this.getPrecisionFromSearchFilterOption(searchFilter.Options, 'max'));
    const mappingData = this.getMappingData(searchFilter.Name);

    return {
      Id: searchFilter.Name.split('_').join(''),
      BackingField: mappingData.BackingField,
      DisplayName: mappingData.DisplayName,
      Order: mappingData.Order,
      Type: FilterType.Range,
      MinimumValue: minValue,
      MaximumValue: maxValue,
      Precision: precision,
      SelectedMinValue: null,
      SelectedMaxValue: null,
      CssClassName: mappingData.DisplayName.toLowerCase().replace(/[\s]/g, '-'),
      SaveDisabled: mappingData.SaveDisabled
    };
  }

  private getNumberValueFromSearchFilterOption(sfo: SearchFilterOption[], name: string): number {
    let value = 0;
    const filteredArray = sfo.filter(x => x.Name === name).map(x => x.Value);
    if (filteredArray[0] !== undefined) {
      value = filteredArray[0];
    }
    return value;
  }

  private getPrecisionFromSearchFilterOption(sfo: SearchFilterOption[], name: string): number {
    let value = 1;
    const filteredArray = sfo.filter(x => x.Name === name).map(x => x.Value);
    if (!!filteredArray.length) {
      const splits = filteredArray[0].toString().split('.');
      value = splits.length > 1 ? splits[1].length : 1;
    }
    return value;
  }

  private getMappingData(searchFilterName: string) {
    return Object.keys(this.searchFilterMappingData).map(e => this.searchFilterMappingData[e])
      .find(sfmd => sfmd.BackingField === searchFilterName);
  }
}
