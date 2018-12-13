import { DataCut, PagingOptions, SurveyDataCutResponse, SurveyJob } from 'libs/models/payfactors-api';
import { ResultsPagingOptions } from 'libs/features/search/models';

import { JobResult, SurveyDataCut } from '../models';

export class PayfactorsSurveySearchApiModelMapper {
  ///
  /// IN
  ///
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

  ///
  /// Private Methods
  ///
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
}
