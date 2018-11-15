import { DataCut, MatchedSurveyJob, PagingOptions, SearchField, SearchFilter, SearchFilterOption, SurveyDataCutResponse,
         SurveyJob } from 'libs/models/survey-search';
import { SurveySavedFilterResponse } from 'libs/models/payfactors-api/user-filter/response';

import { Filter, FilterType, JobResult, JobToPrice, MultiSelectFilter, MultiSelectOption, RangeFilter, ResultsPagingOptions,
  SavedFilter, SurveyDataCut, TextFilter } from '../models';
import { SearchFilterMappingData } from '../data';
import { FiltersHelper } from './filters.helper';


export class PayfactorsApiModelMapper {

  ///
  /// IN
  ///
  static mapSearchFiltersToFilters(searchFilters: SearchFilter[]): Filter[] {
    return searchFilters.map(sf => this.mapSearchFilterToFilter(sf));
  }

  static mapSearchFilterToFilter(searchFilter: SearchFilter): Filter {
    switch (this.getMappingData(searchFilter.Name).Type) {
      case FilterType.Multi:
        return this.mapSearchFilterToMultiFilter(searchFilter);
      case FilterType.Range:
        return this.mapSearchFilterToRangeFilter(searchFilter);
      default:
        return null;
    }
  }

  static mapSurveyJobsToJobResults(surveyJobs: SurveyJob[], selectedDataCuts: DataCut[]): JobResult[] {
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
        IsSelected: this.isJobSelected(sj, selectedDataCuts),
        Base50th: sj.Job.Base50th,
        TCC50th: sj.Job.TCC50th,
        EEO: sj.Job.EEO,
        LoadingDataCutsError: false
      };
    });
  }

  static mapMatchedSurveyJobToJobsToPrice(sjl: MatchedSurveyJob[]): JobToPrice[] {
    return sjl.map((sj: MatchedSurveyJob): JobToPrice => {
      return {
        Code: sj.Job.Code,
        JobMatchCuts: [],
        Description: sj.Job.Description,
        Family: sj.Job.Family,
        Id: Number(sj.Id),
        Level: sj.Job.Level,
        Paymarket: sj.Paymarket,
        PaymarketId: sj.PaymarketId,
        Title: sj.Job.Title,
        TotalDataCuts: sj.DataCutsCount,
        LoadingDataCuts: false,
        LoadingDataCutsError: false
      };
    });
  }

  static mapSurveyDataCutResultsToDataCut(dataCuts: SurveyDataCutResponse[], selectedDataCuts: DataCut[]): SurveyDataCut[] {
    return dataCuts.map((dc: SurveyDataCutResponse) => {
      return {
        SurveyDataId: dc.SurveyDataId,
        Title: dc.Title,
        Country: dc.Country,
        Weight: dc.Weight,
        Base50th: dc.Base50,
        TCC50th: dc.Tcc50,
        Matches: dc.Matches,
        IsSelected: this.isCutSelected(dc, selectedDataCuts)
      };
    });
  }

  static mapSurveySavedFilterResponseToSavedFilter(surveySavedFilterResponse: SurveySavedFilterResponse[]): SavedFilter[] {
    return surveySavedFilterResponse.map(ssfr => {
      return {
        Id: ssfr.Id,
        Name: ssfr.Name,
        MetaInfo: ssfr.MetaInfo,
        Filters: FiltersHelper.selectAll(this.mapSearchFiltersToFilters(ssfr.Filters)),
        Selected: false
      };
    });
  }

  static mapSearchFilterOptionsToMultiSelectOptions(sfo: SearchFilterOption[]): MultiSelectOption[] {
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
  static mapFiltersToSearchFields(filters: Filter[]): SearchField[] {
    return filters.map((f: TextFilter) => {
      return {
        Name: f.BackingField,
        Value: f.Value
      };
    });
  }

  static mapRangeFiltersToSearchFilters(rangeFilters: RangeFilter[]): SearchFilter[] {
    return rangeFilters.map(rf => this.mapRangeFilterToSearchFilter(rf));
  }

  static mapMultiSelectFiltersToSearchFilters(multiSelectFilters: MultiSelectFilter[]): SearchFilter[] {
    return multiSelectFilters.map(msf => this.mapMultiSelectFilterToSearchFilter(msf));
  }

  static mapResultsPagingOptionsToPagingOptions(resultsPagingOptions: ResultsPagingOptions): PagingOptions {
    return {
      From: resultsPagingOptions.pageSize * (resultsPagingOptions.page - 1),
      Count: resultsPagingOptions.pageSize
    };
  }

  ///
  /// Private Methods
  ///

  private static mapRangeFilterToSearchFilter(rangeFilter: RangeFilter): SearchFilter {
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

  private static mapMultiSelectFilterToSearchFilter(filter: MultiSelectFilter): SearchFilter {
    return {
      Name: filter.BackingField,
      Options: this.mapMultiSelectOptionsToSearchFilterOptions(filter.Options)
    };
  }

  private static mapMultiSelectOptionsToSearchFilterOptions(multiSelectOptions: MultiSelectOption[]): SearchFilterOption[] {
    return multiSelectOptions.filter(mso => mso.Selected).map(mso => {
      return {
        Name: mso.Name,
        Value: mso.Value
      };
    });
  }

  private static mapSearchFilterToMultiFilter(searchFilter: SearchFilter): MultiSelectFilter {
    const mappingData = this.getMappingData(searchFilter.Name);
    return {
      Id: searchFilter.Name.split('_').join(''),
      BackingField: mappingData.BackingField,
      DisplayName: mappingData.DisplayName,
      Options: this.mapSearchFilterOptionsToMultiSelectOptions(searchFilter.Options),
      Type: FilterType.Multi,
      RefreshOptionsFromServer: searchFilter.Name !== 'combined_scopes_weighted',
      Order: mappingData.Order,
      OptionCountDisabled: mappingData.OptionCountDisabled,
      CssClassName: mappingData.DisplayName.toLowerCase().replace(/[\s]/g, '-'),
      DefaultSelections: []
    };
  }

  private static mapSearchFilterToRangeFilter(searchFilter: SearchFilter): RangeFilter {
    const minValue = Number(this.getNumberValueFromSearchFilterOption(searchFilter.Options, 'min'));
    const maxValue = Number(this.getNumberValueFromSearchFilterOption(searchFilter.Options, 'max'));
    const precision = Number(this.getPrecisionFromSearchFilterOption(searchFilter.Options, 'max'));
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
      SelectedMaxValue: null,
      CssClassName: SearchFilterMappingData[searchFilter.Name].DisplayName.toLowerCase().replace(/[\s]/g, '-')
    };
  }

  private static getNumberValueFromSearchFilterOption(sfo: SearchFilterOption[], name: string): number {
    let value = 0;
    const filteredArray = sfo.filter(x => x.Name === name).map(x => x.Value);
    if (filteredArray[0] !== undefined) {
      value = filteredArray[0];
    }
    return value;
  }

  private static getPrecisionFromSearchFilterOption(sfo: SearchFilterOption[], name: string): number {
    let value = 1;
    const filteredArray = sfo.filter(x => x.Name === name).map(x => x.Value);
    if (!!filteredArray.length) {
      const splits = filteredArray[0].toString().split('.');
      value = splits.length > 1 ? splits[1].length : 1;
    }
    return value;
  }

  private static isJobSelected(surveyJob: SurveyJob, selectedCuts: DataCut[]) {
    if (!surveyJob.IsPayfactorsJob) {
      return false;
    }
    return selectedCuts.some(cutData =>
      cutData.CountryCode === surveyJob.Job.CountryCode && cutData.SurveyJobCode === surveyJob.Job.Code);
  }

  private static isCutSelected(dataCut: SurveyDataCutResponse, selectedCuts: DataCut[]) {
    return selectedCuts.some(cutData =>
      cutData.DataCutId === dataCut.SurveyDataId);
  }

  private static getMappingData(searchFilterName: string) {
    return Object.keys(SearchFilterMappingData).map(e => SearchFilterMappingData[e])
      .find(sfmd => sfmd.BackingField === searchFilterName);
  }
}
