import { SurveySearchResultDataSources } from 'libs/constants';
import {
  AddSurveyDataCutRequest,
  JobDataCut,
  SurveyJob,
  PeerCut,
  ExchangeJobDataResponse,
  DataCutResponse, ExchangeJobDataCutResponse
} from 'libs/models/payfactors-api';

import { DataCutDetails, JobContext, JobResult, ProjectSearchContext, PeerJobInfo, DataCut } from '../models';

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
      JobDataCuts: this.mapDataCutDetailsToJobDataCuts(selectedDataCuts),
      ExcludeFromParticipation: excludeFromParticipation,
      PayMarketId : jobContext.JobPayMarketId,
      CompanyPayMarketId: projectSearchContext.PayMarketId,
      JobCode: jobContext.JobCode,
      PeerDataCuts: this.mapDataCutDetailsToPeerCuts(selectedDataCuts)
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
        LoadingDataCutsError: false,
        PeerJobInfo: this.getPeerJobInfo(sj)
      };
    });
  }

  static mapDataCutResponseToDataCut(dataCuts: DataCutResponse[], selectedDataCuts: DataCutDetails[]): DataCut[] {
    return dataCuts.map((dc: DataCutResponse) => {
      return {
        Id: dc.Id,
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

  static mapExchangeJobDataCutResponseToDataCut(response: ExchangeJobDataCutResponse[], selectedDataCuts: DataCutDetails[]): DataCut[] {
    return response.map(r => {
      return {
        Id: r.ExchangeJobId,
        Title: r.Title,
        Country: r.Country,
        Weight: r.Weight,
        Base50th: r.Base50,
        TCC50th: r.Tcc50,
        Incs: r.Incs,
        Orgs: r.Orgs,
        Matches: null,
        IsSelected: this.isCutSelected(r, selectedDataCuts)
      };
    });
  }


  ///
  /// OUT
  ///
  static mapDataCutDetailsToJobDataCuts(dataCutDetails: DataCutDetails[]): JobDataCut[] {
    if (!dataCutDetails) {
      return [];
    }
    return dataCutDetails
    .filter((dcd: DataCutDetails) => dcd.DataSource !== SurveySearchResultDataSources.Peer)
    .map((dcd: DataCutDetails) => {
      return {
        DataCutId: dcd.DataCutId,
        SurveyJobCode: dcd.SurveyJobCode,
        SurveyJobId: dcd.SurveyJobId,
        IsPayfactorsJob: dcd.DataSource === SurveySearchResultDataSources.Payfactors,
        CountryCode: dcd.CountryCode
      };
    });
  }

  static mapDataCutDetailsToPeerCuts(dataCutDetails: DataCutDetails[]): PeerCut[] {
    if (!dataCutDetails) {
      return [];
    }
    return dataCutDetails
    .filter((dcd: DataCutDetails) => dcd.DataSource === SurveySearchResultDataSources.Peer)
      .map((dcd: DataCutDetails) => {
        return {
          ExchangeId: dcd.Job.PeerJobInfo.ExchangeId,
          ExchangeJobId: dcd.Job.PeerJobInfo.ExchangeJobId
        };
      });
  }

  ///
  /// Private Methods
  ///
  private static isJobSelected(surveyJob: SurveyJob, selectedCuts: DataCutDetails[]) {
    switch (surveyJob.DataSource) {
      case SurveySearchResultDataSources.Payfactors:
        return selectedCuts.some(cutData =>
          cutData.CountryCode === surveyJob.Job.CountryCode && cutData.SurveyJobCode === surveyJob.Job.Code);
      case SurveySearchResultDataSources.Peer:
        return selectedCuts.some(dataCut =>
          dataCut.DataSource === SurveySearchResultDataSources.Peer && dataCut.Job.PeerJobInfo.Id === surveyJob.Id);
      default:
          return false;
    }
  }

  private static isCutSelected(dataCut: DataCutResponse, selectedCuts: DataCutDetails[]) {
    return selectedCuts.some(sc =>
      sc.DataCutId === dataCut.Id);
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

  private static getPeerJobInfo(surveyJob: SurveyJob): PeerJobInfo {
    if (!!surveyJob.Job.ExchangeId && !!surveyJob.Job.ExchangeJobId) {
      return {
        Id: surveyJob.Id,
        ExchangeId: surveyJob.Job.ExchangeId,
        ExchangeJobId: surveyJob.Job.ExchangeJobId
      };
    }
    return null;
  }
}
