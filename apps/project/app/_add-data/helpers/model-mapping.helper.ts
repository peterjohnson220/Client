import { generateGuid } from 'libs/core/functions';
import {
  PagingOptions,
  SearchField,
  SurveyJob,
  SearchFilter,
  SearchFilterOption,
  SurveyDataCutResponse,
  DataCut
} from 'libs/models/survey-search';

import {
  Filter, FilterType, isMultiFilter, isTextFilter, JobResult, MultiSelectFilter, MultiSelectOption,
  ResultsPagingOptions, TextFilter,  SurveyDataCut,
} from '../models';
import { SearchFilterDisplaysAndBackings, SearchFilterBackingField } from '../data';


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
      Level: '',
      Source: sj.Survey.Publisher,
      Description: sj.Job.Description,
      IsPayfactors: sj.IsPayfactorsJob,
      MatchCount: 0,
      EffectiveDate: sj.IsPayfactorsJob ?
        new Date(currentdate.getFullYear(), currentdate.getMonth(), 1) :
        sj.Survey.EffectiveDateTime,
      Category: sj.Job.Category,
      FLSAStatus: sj.Job.FLSAStatus,
      CountryCode: sj.Job.CountryCode,
      LoadingDataCuts: false,
      DataCuts: [],
      IsSelected: isJobSelected(sj, selectedDataCuts),
      Base50Th: sj.Job.Base50Th,
      Tcc50Th: sj.Job.Tcc50Th
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

export function mapFiltersToSearchFilters(filters: Filter[]): SearchFilter[] {
  return getMultiFiltersWithValues(filters).map((f: MultiSelectFilter) => {
    return {
      Name: f.BackingField,
      Options: getAllSelectedOptions(f)
    };
  });
}

export function mapSearchFilterToFilter(searchFilter: SearchFilter): MultiSelectFilter {
  return {
    Id: searchFilter.Name.split('_').join(''),
    BackingField: SearchFilterBackingField[searchFilter.Name],
    DisplayName: SearchFilterDisplaysAndBackings[searchFilter.Name],
    Options: mapSearchFilterOptionsToMultiSelectOptions(searchFilter.Options),
    Type: FilterType.Multi
  };
}

export function mapSearchFilterOptionsToMultiSelectOptions(sfo: SearchFilterOption[]): MultiSelectOption[] {
  return sfo.map((o: SearchFilterOption): MultiSelectOption => {
    return {
      Id: generateGuid(),
      Name: o.Name,
      Value: o.Value,
      Count: o.Count,
      Selected: false
    };
  });
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
      Match: 0,
      IsSelected: isCutSelected(dc, selectedDataCuts)
    };
  });
}

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
