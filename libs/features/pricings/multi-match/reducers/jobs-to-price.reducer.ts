import cloneDeep from 'lodash/cloneDeep';

import { JobMatchCut } from 'libs/models/payfactors-api';
import { arraySortByString, SortDirection } from 'libs/core/functions';
import { DataCutSummaryEntityTypes, SurveySearchResultDataSources } from 'libs/constants';

import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import { JobToPrice } from '../models';
import { DataCutDetails } from '../../../surveys/survey-search/models';
import { DataCutSummaryTypes } from '../../data-cut-summary/constants';

export interface EditableTempDataCut {
  CompanyJobId: number;
  JobMatchCut: JobMatchCut;
}

export interface State {
  loadingJobs: boolean;
  loadingJobsError: boolean;
  jobsToPrice: JobToPrice[];
}

const initialState: State = {
  loadingJobs: false,
  jobsToPrice: [],
  loadingJobsError: false
};

// Reducer function
export function reducer(state = initialState, action: fromJobsToPriceActions.JobsToPriceActions): State {
  switch (action.type) {

    case fromJobsToPriceActions.GET_JOBS_TO_PRICE: {
      return {
        ...state,
        loadingJobs: true
      };
    }
    case fromJobsToPriceActions.GET_JOBS_TO_PRICE_SUCCESS: {
      return {
        ...state,
        loadingJobs: false,
        jobsToPrice: action.payload
      };
    }
    case fromJobsToPriceActions.GET_JOBS_TO_PRICE_ERROR: {
      return {
        ...state,
        loadingJobs: false,
        loadingJobsError: true
      };
    }
    case fromJobsToPriceActions.GET_PRICING_MATCHES: {
      const jobToPriceId = action.pricingId;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = true;
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.GET_MATCH_JOB_CUTS: {
      const jobToPriceId = action.payload.Id;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = true;
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.GET_MATCH_JOB_CUTS_SUCCESS: {
      const jobToPriceId = action.payload.JobId;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = false;
      jobToPrice.LoadingDataCutsError = false;
      jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts || [];
      jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts.concat(action.payload.JobMatchCuts);
      jobToPrice.JobMatchCuts.sort((a, b) => arraySortByString(a.JobTitle, b.JobTitle, SortDirection.Ascending));
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.GET_MATCH_JOB_CUTS_ERROR: {
      const jobToPriceId = action.payload.Id;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = false;
      jobToPrice.LoadingDataCutsError = true;
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.CLEAR_ALL_JOBS: {
      return {
        ...state,
        jobsToPrice: []
      };
    }
    case fromJobsToPriceActions.ADD_DATA_CUTS_TO_JOB_TO_PRICE: {
      const dataCuts = action.payload.DataCuts;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = action.payload.JobId !== 0 ? jobsToPriceCopy.find(x => x.Id === action.payload.JobId) :
        jobsToPriceCopy.find(x => x.PaymarketId === action.payload.PaymarketId && x.CompanyJobId === action.payload.CompanyJobId);
      if (jobToPrice) {
        addJobCuts(jobToPrice, dataCuts);
      }
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.REMOVE_JOB_CUT: {
      const cutToRemove = action.payload.DataCut;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === action.payload.JobId);
      if (jobToPrice) {
        removeJobMatchCut(jobToPrice, cutToRemove);
      }
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.REPLACE_EDITED_DATA_CUT: {
      const existingCutIdentity = action.payload.existing;
      const newCut = action.payload.tempDataCut;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToReplaceCut = jobsToPriceCopy.find(job => job.CompanyJobId === existingCutIdentity.JobId);
      const existingCut: JobMatchCut = jobToReplaceCut?.JobMatchCuts?.find(cut => cut.MatchId === existingCutIdentity.MatchId) ?? null;
      if (!!existingCut) {
        const newDataCutDetails: DataCutDetails = {
          CountryCode: newCut.Country,
          DataSource: SurveySearchResultDataSources.Peer,
          Job: <any>{
            Title: existingCut.JobTitle,
            Code: existingCut.JobCode,
            Source: existingCut.Source,
            PeerJobInfo: {
              ExchangeJobId: existingCutIdentity?.ExchangeJobId
            }
          },
          TCC50th: newCut.TCC50th,
          Base50th: newCut.Base50th,
          ServerInfo: newCut.ServerInfo,
          CutFilterId: newCut.Id,
          WeightingType: newCut.Weight,
          Orgs: newCut.Orgs,
          Incs: newCut.Incs
        };
        removeJobMatchCut(jobToReplaceCut, existingCut);
        addJobCuts(jobToReplaceCut, [newDataCutDetails]);
      }

      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    default: {
      return state;
    }
  }
}

function mapDataCutToMatchCut(jobCuts: DataCutDetails[]): JobMatchCut[] {
  return jobCuts.map(jobCut => {
    return {
      MatchId: getMatchId(jobCut),
      MatchType: getMatchType(jobCut),
      JobTitle: jobCut.Job.Title,
      JobCode: jobCut.Job.Code,
      MatchSourceCode: getMatchSourceCode(jobCut),
      Source: getJobSource(jobCut),
      Base50: Number(jobCut.Base50th),
      TCC50: Number(jobCut.TCC50th),
      SurveyJobCode: jobCut.SurveyJobCode,
      PeerCutId: getPeerCutId(jobCut),
      DataSourceJobId: getDataSourceJobId(jobCut),
      CutFilterId: jobCut.CutFilterId,
      MatchWeight: 1,
      MatchAdjustment: 0,
      Incs: jobCut.Incs,
      Orgs: jobCut.Orgs,
      WeightingType: jobCut.WeightingType
    };
  });
}

function getPeerCutId(jobCut: DataCutDetails): string {
  return jobCut.DataSource === SurveySearchResultDataSources.Peer ? jobCut.ServerInfo.CustomPeerCutId : null;
}
function getDataSourceJobId(jobCut: DataCutDetails): number|null {
  switch (jobCut.DataSource) {
    case SurveySearchResultDataSources.Peer:
      return jobCut?.Job?.PeerJobInfo?.ExchangeJobId;
    default:
      return null;
  }
}

function getJobSource(jobCut: DataCutDetails): string {
  switch (jobCut.DataSource) {
    case SurveySearchResultDataSources.Surveys:
      return jobCut.Job.Source + ': ' + jobCut.Job.SurveyName + ' ' + formatDate(jobCut.Job.EffectiveDate.toString());
    case SurveySearchResultDataSources.Peer:
      return !!jobCut.Job.SurveyName ? jobCut.Job.Source + ' - ' + jobCut.Job.SurveyName : jobCut.Job.Source;
    default:
      return jobCut.Job.Source;
  }
}

function getMatchSourceCode(jobCut: DataCutDetails): string {
  switch (jobCut.DataSource) {
    case SurveySearchResultDataSources.Surveys:
      return DataCutSummaryTypes.SURVEY;
    case SurveySearchResultDataSources.Peer:
      return DataCutSummaryTypes.PEER;
    default:
      return DataCutSummaryTypes.MD_JOB;
  }
}

function getMatchId(jobCut: DataCutDetails): any {
  if (jobCut.DataSource === SurveySearchResultDataSources.Payfactors && jobCut.SurveyJobCode) {
    return jobCut.SurveyJobCode;
  } else {
    const serverInfo = jobCut.ServerInfo;

    if (serverInfo) {
      if (serverInfo.DailyScopeAvgId) {
        return serverInfo.DailyScopeAvgId;
      } else if (serverInfo.DailyNatAvgId) {
        return serverInfo.DailyNatAvgId;
      } else if (serverInfo.SurveyDataId) {
        return serverInfo.SurveyDataId;
      } else if (serverInfo.CustomPeerCutId) {
        return serverInfo.CustomPeerCutId;
      }
    }
  }
}

function getMatchType(jobCut: DataCutDetails): DataCutSummaryEntityTypes {
  if (jobCut.DataSource === SurveySearchResultDataSources.Payfactors && jobCut.SurveyJobCode) {
    return DataCutSummaryEntityTypes.MDJobCode;
  } else {
    const serverInfo = jobCut.ServerInfo;

    if (serverInfo) {
      if (serverInfo.DailyScopeAvgId) {
        return DataCutSummaryEntityTypes.DailyScopeAvgId;
      } else if (serverInfo.DailyNatAvgId) {
        return DataCutSummaryEntityTypes.DailyNatAvgId;
      } else if (serverInfo.SurveyDataId) {
        return DataCutSummaryEntityTypes.SurveyDataId;
      } else if (serverInfo.CustomPeerCutId) {
        return DataCutSummaryEntityTypes.CustomPeerCutId;
      }
    }
  }
}

function addJobCuts(jobToPrice: JobToPrice, newDataCuts: DataCutDetails[]) {
  const existingCustomPeerCutIds = jobToPrice.JobMatchCuts.filter(cut =>
    cut.MatchType === DataCutSummaryEntityTypes.CustomPeerCutId)?.map(cut => cut.MatchId) ?? [];
  const newDataCutsNotAlreadyAdded = newDataCuts.filter(newCut => existingCustomPeerCutIds.indexOf(getMatchId(newCut)) < 0);
  jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts || [];
  jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts.concat(mapDataCutToMatchCut(newDataCutsNotAlreadyAdded));
  jobToPrice.TotalDataCuts += newDataCutsNotAlreadyAdded.length;
  // sort after adding
  jobToPrice.JobMatchCuts.sort((a, b) => arraySortByString(a.JobTitle, b.JobTitle, SortDirection.Ascending));
  // track cuts added
  jobToPrice.DataCutsToAdd = jobToPrice.DataCutsToAdd || [];
  jobToPrice.DataCutsToAdd = jobToPrice.DataCutsToAdd.concat(newDataCutsNotAlreadyAdded);
}

function removeJobMatchCut(jobToPrice: JobToPrice, cutToRemove: JobMatchCut) {
  if (cutToRemove.MatchType === DataCutSummaryEntityTypes.CompanyJobPricingMatchId ||
    cutToRemove.MatchType === DataCutSummaryEntityTypes.UserJobMatchId) {
    // remove job match cut and track deleted id
    jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts.filter(x => x.MatchId !== cutToRemove.MatchId);
    jobToPrice.DeletedJobMatchCutIds = jobToPrice.DeletedJobMatchCutIds || [];
    jobToPrice.DeletedJobMatchCutIds.push(<any>cutToRemove.MatchId);
  } else {
    // new data cut filter
    const cutFilter = x => x.CutFilterId === cutToRemove.CutFilterId;
    const matchingJobCut = jobToPrice.JobMatchCuts.find(cutFilter);
    const matchingDataCut = jobToPrice.DataCutsToAdd.find(cutFilter);
    jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts.filter(x => x !== matchingJobCut);
    jobToPrice.DataCutsToAdd = jobToPrice.DataCutsToAdd.filter(x => x !== matchingDataCut);
  }
  jobToPrice.TotalDataCuts--;
}

function formatDate(dateString: string): string {
  if (dateString) {
    return new Date(dateString).toLocaleDateString('en-US');
  }
  return '';
}
// Selector functions
export const getLoadingJobs = (state: State) => state.loadingJobs;
export const getLoadingJobsError = (state: State) => state.loadingJobsError;
export const getJobsToPrice = (state: State) => state.jobsToPrice;
