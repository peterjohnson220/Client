import {
  DataCut,
  PagingOptions,
  SearchField,
  SearchFilter,
  SearchFilterOption,
  SurveyDataCutResponse,
  SurveyJob
} from 'libs/models/survey-search';

import {
  Filter,
  FilterType,
  isMultiFilter, isRangeFilter,
  isTextFilter,
  JobResult,
  MultiSelectFilter,
  MultiSelectOption,
  RangeFilter,
  ResultsPagingOptions,
  SurveyDataCut,
  TextFilter,
} from '../models';
import { SearchFilterMappingData } from '../data';

// Exports
export function mapSurveyJobsToJobResults(surveyJobs: SurveyJob[], selectedDataCuts: DataCut[]): JobResult[] {
  const currentdate = new Date();
  return surveyJobs.map((sj: SurveyJob) => {
    return {
      Id: parseInt(sj.Id, 10),
      Title: sj.Job.Title,
      Code: sj.Job.Code,
      SurveyName: sj.Survey.Title,
      Family: sj.Job.Family,
      Level: sj.Job.Level,
      Source: sj.Survey.Publisher,
      Description: sj.Job.Description,
      IsPayfactors: sj.IsPayfactorsJob,
      Matches: 0,
      EffectiveDate: sj.IsPayfactorsJob ?
        new Date(currentdate.getFullYear(), currentdate.getMonth(), 1) :
        sj.Survey.EffectiveDateTime,
      Category: sj.Job.Category,
      FLSAStatus: sj.Job.FLSAStatus,
      CountryCode: sj.Job.CountryCode,
      LoadingDataCuts: false,
      LoadingMoreDataCuts: false,
      DataCuts: [],
      IsSelected: isJobSelected(sj, selectedDataCuts),
      Base50th: sj.Job.Base50th,
      TCC50th: sj.Job.TCC50th,
      EEO: sj.Job.EEO
    };
  });
}

export function mapResultsPagingOptionsToPagingOptions(resultsPagingOptions: ResultsPagingOptions): PagingOptions {
  return {
    From: resultsPagingOptions.pageSize * (resultsPagingOptions.page - 1),
    Count: resultsPagingOptions.pageSize
  };
}

export function mapFiltersToSearchFields(filters: Filter[]): SearchField[] {
  return getTextFiltersWithValues(filters).map((f: TextFilter) => {
    return {
      Name: f.BackingField,
      Value: f.Value
    };
  });
}

export function getSelectedSearchFilters(filters: Filter[]): SearchFilter[] {
  return getMultiFiltersWithValues(filters).map((f: MultiSelectFilter) => {
    return {
      Name: f.BackingField,
      Options: getAllSelectedOptions(f)
    };
  }).concat(getRangeFilterAsMultiSelect(filters));
}

export function mapSearchFilterToFilter(searchFilter: SearchFilter): Filter {
  switch (SearchFilterMappingData[searchFilter.Name].Type) {
    case FilterType.Multi:
      return mapSearchFilterToMultiFilter(searchFilter);
    case FilterType.Range:
      return mapSearchFilterToRangeFilter(searchFilter);
    default:
        return null;
  }
}

export function mapSearchFilterToMultiFilter(searchFilter: SearchFilter): MultiSelectFilter {
  return {
    Id: searchFilter.Name.split('_').join(''),
    BackingField: SearchFilterMappingData[searchFilter.Name].BackingField,
    DisplayName: SearchFilterMappingData[searchFilter.Name].DisplayName,
    Options: mapSearchFilterOptionsToMultiSelectOptions(searchFilter.Options),
    Type: FilterType.Multi,
    RefreshOptionsFromServer: searchFilter.Name !== 'default_survey_scopes',
    Order: SearchFilterMappingData[searchFilter.Name].Order,
    OptionCountDisabled: isOptionCountDisabled(searchFilter.Name)
  };
}

export function mapSearchFilterOptionsToMultiSelectOptions(sfo: SearchFilterOption[]): MultiSelectOption[] {
  return sfo.map((o: SearchFilterOption): MultiSelectOption => {
    return {
      Name: o.Name,
      Value: o.Value,
      Count: o.Count,
      Selected: false
    };
  });
}

export function mapSearchFilterToRangeFilter(searchFilter: SearchFilter): RangeFilter {
  const minValue = Number(getNumberValueFromSearchFilterOption(searchFilter.Options, 'min'));
  const maxValue = Number(getNumberValueFromSearchFilterOption(searchFilter.Options, 'max'));
  const precision = Number(getPrecisionFromSearchFilterOption(searchFilter.Options, 'max'));
  return {
    Id: searchFilter.Name.split('_').join(''),
    BackingField: SearchFilterMappingData[searchFilter.Name].BackingField,
    DisplayName: SearchFilterMappingData[searchFilter.Name].DisplayName,
    Order: SearchFilterMappingData[searchFilter.Name].Order,
    Type: FilterType.Range,
    MinimumValue: minValue,
    MaximumValue: maxValue,
    Precision: precision,
    SelectedMinValue: null,
    SelectedMaxValue: null
  };
}

export function getNumberValueFromSearchFilterOption(sfo: SearchFilterOption[], name: string): number {
  let value = 0;
  const filteredArray = sfo.filter(x => x.Name === name).map(x => x.Value);
  if (filteredArray[0] !== undefined) {
    value = filteredArray[0];
  }
  return value;
}

export function getPrecisionFromSearchFilterOption(sfo: SearchFilterOption[], name: string): number {
  let value = 1;
  const filteredArray = sfo.filter(x => x.Name === name).map(x => x.Value);
  if (filteredArray[0] !== undefined) {
    value = (filteredArray[0] + '').split('.')[1].length;
  }
  return value;
}

export function mapSurveyDataCutResultsToDataCut(dataCuts: SurveyDataCutResponse[], selectedDataCuts: DataCut[]): SurveyDataCut[] {
  return dataCuts.map((dc: SurveyDataCutResponse) => {
    return {
      SurveyDataId: dc.SurveyDataId,
      Title: dc.Title,
      Country: dc.Country,
      Weight: dc.Weight,
      Base50th: dc.Base50,
      TCC50th: dc.Tcc50,
      Matches: dc.Matches,
      IsSelected: isCutSelected(dc, selectedDataCuts)
    };
  });
}

export function mapSearchFiltersToMultiSelectFilters(searchFilters: SearchFilter[]): Filter[] {
  return searchFilters.map(sf => mapSearchFilterToFilter(sf));
}

// Helpers
function getAllSelectedOptions(filter: MultiSelectFilter): any[] {
  return filter.Options.filter(o => o.Selected).map(o => ({ Value: o.Value}));
}

function getTextFiltersWithValues(filters: Filter[]) {
  return filters.filter(f => isTextFilter(f) && f.Value);
}

function isJobSelected(surveyJob: SurveyJob, selectedCuts: DataCut[]) {
  if (!surveyJob.IsPayfactorsJob) {
    return false;
  }
  return selectedCuts.some(cutData =>
    cutData.CountryCode === surveyJob.Job.CountryCode && cutData.SurveyJobCode === surveyJob.Job.Code);
}

function isCutSelected(dataCut: SurveyDataCutResponse, selectedCuts: DataCut[]) {
  return selectedCuts.some(cutData =>
    cutData.DataCutId === dataCut.SurveyDataId);
}

function getMultiFiltersWithValues(filters: Filter[]) {
  return filters.filter(f => isMultiFilter(f) && f.Options.some(o => o.Selected));
}

function getRangeFilterAsMultiSelect(filters: Filter[]) {
  return filters.filter(f => isRangeFilter(f)
    && (f.MaximumValue !== f.SelectedMaxValue || f.MinimumValue !== f.SelectedMinValue)
    && f.SelectedMinValue != null && f.SelectedMaxValue != null).map((f: RangeFilter) => {
      return {
        Name: f.BackingField,
        Options: [{
          Name: 'min',
          Value: f.SelectedMinValue
        }, {
          Name: 'max',
          Value: f.SelectedMaxValue
        }]
      };
  });
}

function isOptionCountDisabled(filterOptionName: string) {
  let result = false;
  switch (filterOptionName) {
    case 'country_codes':
    case 'weighting_types':
      result = true;
      break;
    default:
      break;
  }
  return result;
}

export function replaceDefaultFiltersWithSavedFilters(filters: SearchFilter[], savedFilters: SearchFilter[]): SearchFilter[] {
  savedFilters.forEach(savedFilter => {
    const defaultFilterIndex = filters.findIndex(f => f.Name === savedFilter.Name);
    if (defaultFilterIndex === -1) {
      filters.push(savedFilter);
    } else if (allowOverrideDefaultFilter(savedFilter.Name)) {
      filters.splice(defaultFilterIndex, 1, savedFilter);
    }
  });
  return filters;
}

function allowOverrideDefaultFilter(filterName: string) {
  let result = true;
  switch (filterName) {
    case 'country_codes':
      result = false;
      break;
    default:
      break;
  }
  return result;
}
