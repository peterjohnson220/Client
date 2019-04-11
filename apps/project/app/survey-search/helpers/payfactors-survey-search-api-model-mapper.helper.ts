import { SurveySearchResultDataSources } from 'libs/constants';
import { AddSurveyDataCutRequest, DataCut, SurveyDataCutResponse, SurveyJob } from 'libs/models/payfactors-api';

import { DataCutDetails, JobContext, JobResult, ProjectSearchContext, SurveyDataCut } from '../models';

export class PayfactorsSurveySearchApiModelMapper {

  ///
  /// Helpers
  ///
  static buildAddSurveyDataCutRequest(
    excludeFromParticipation: boolean,
    jobContext: JobContext,
    projectSearchContext: ProjectSearchContext,
    selectedDataCuts: DataCutDetails[]): AddSurveyDataCutRequest {
    return {
      CompanyJobId: jobContext.CompanyJobId,
      ProjectId: projectSearchContext.ProjectId,
      JobDataCuts: this.mapDataCutDetailstoDataCuts(selectedDataCuts),
      ExcludeFromParticipation: excludeFromParticipation,
      PayMarketId : jobContext.JobPayMarketId,
      CompanyPayMarketId: projectSearchContext.PayMarketId,
      JobCode: jobContext.JobCode,
      PeerDataCuts: []
    };
  }

  ///
  /// IN
  ///
  static mapSurveyJobsToJobResults(surveyJobs: SurveyJob[], selectedDataCuts: DataCutDetails[]): JobResult[] {
    return surveyJobs.map((sj: SurveyJob) => {
      return {
        Id: parseInt(sj.Id, 10),
        DataSource: sj.DataSource,
        Title: sj.Job.Title,
        Code: sj.Job.Code,
        SurveyName: sj.Survey.Title,
        Family: sj.Job.Family,
        Level: sj.Job.Level,
        Source: sj.Survey.Publisher,
        Description: sj.Job.Description,
        Matches: 0,
        EffectiveDate: this.getEffectiveDate(sj),
        Category: sj.Job.Category,
        FLSAStatus: sj.Job.FLSAStatus,
        CountryCode: sj.Job.CountryCode,
        LoadingDataCuts: false,
        LoadingMoreDataCuts: false,
        DataCuts: [],
        IsSelected: this.isJobSelected(sj, selectedDataCuts),
        Incs: sj.Job.Incs,
        Orgs: sj.Job.Orgs,
        Base50th: sj.Job.Base50th,
        TCC50th: sj.Job.TCC50th,
        EEO: sj.Job.EEO,
        LoadingDataCutsError: false
      };
    });
  }

  static mapSurveyDataCutResultsToDataCut(dataCuts: SurveyDataCutResponse[], selectedDataCuts: DataCutDetails[]): SurveyDataCut[] {
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
  /// OUT
  ///
  static mapDataCutDetailstoDataCuts(dataCutDetails: DataCutDetails[]): DataCut[] {
    return dataCutDetails.map((dcd: DataCutDetails) => {
      return {
        DataCutId: dcd.DataCutId,
        SurveyJobCode: dcd.SurveyJobCode,
        SurveyJobId: dcd.SurveyJobId,
        IsPayfactorsJob: dcd.DataSource === SurveySearchResultDataSources.Payfactors,
        CountryCode: dcd.CountryCode
      };
    });
  }

  ///
  /// Private Methods
  ///
  private static isJobSelected(surveyJob: SurveyJob, selectedCuts: DataCutDetails[]) {
    if (surveyJob.DataSource !== SurveySearchResultDataSources.Payfactors) {
      return false;
    }
    return selectedCuts.some(cutData =>
      cutData.CountryCode === surveyJob.Job.CountryCode && cutData.SurveyJobCode === surveyJob.Job.Code);
  }

  private static isCutSelected(dataCut: SurveyDataCutResponse, selectedCuts: DataCutDetails[]) {
    return selectedCuts.some(cutData =>
      cutData.DataCutId === dataCut.SurveyDataId);
  }

  private static getEffectiveDate(surveyJob: SurveyJob) {
    const currentDate = new Date();
    let effectiveDate;

    switch (surveyJob.DataSource) {
      case SurveySearchResultDataSources.Surveys :
        effectiveDate = surveyJob.Survey.EffectiveDateTime;
        break;
      case SurveySearchResultDataSources.Payfactors:
        effectiveDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        break;
      case SurveySearchResultDataSources.Peer:
        effectiveDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay());
        break;
    }

    return effectiveDate;
  }
}
