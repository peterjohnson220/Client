// Import all exports from our feature's actions
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import { CompanyJob, CompanyJobWithMatches } from '../models/';
import * as fromCompanyJobsActions from '../actions/company-jobs.actions';

export interface State extends EntityState<CompanyJob> {
  companyJobsToAssociate: CompanyJobWithMatches[];
  companyJobIdFilters: number[];
  loading: boolean;
  loadingError: boolean;
  loadingErrorMessage: string;
  badRequestMessage: string;
  total: number;
  searchTerm: string;
  selectedCompanyJobInDetailPanel: CompanyJob;
  isDetailPanelExpanded: boolean;
  // jdm PDF download
  loadingJdmDescriptionId: boolean;
  loadingJdmDescriptionIdSuccess: boolean;
  jdmDescriptionIds: number[];
  downloadingJdmDescription: boolean;
  downloadingJdmDescriptionError: boolean;
}

// Define Adapter
export const adapter: EntityAdapter<CompanyJob> = createEntityAdapter<CompanyJob>({
  selectId: (companyJobGridItem: CompanyJob) => companyJobGridItem.CompanyJobId
});

// Define initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  companyJobsToAssociate: [],
  loadingErrorMessage: '',
  badRequestMessage: '',
  selectedCompanyJobs: [],
  total: 0,
  searchTerm: '',
  selectedCompanyJobInDetailPanel: {} as CompanyJob,
  isDetailPanelExpanded: false,
  companyJobIdFilters: [],
  // jdm PDF download
  loadingJdmDescriptionId: false,
  loadingJdmDescriptionIdSuccess: false,
  jdmDescriptionIds: [],
  downloadingJdmDescription:  false,
  downloadingJdmDescriptionError: false
});

// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.JobAssociationModalCompanyJobs,
    (featureState = initialState, featureAction: fromCompanyJobsActions.Actions): State => {
      switch (featureAction.type) {
        case fromCompanyJobsActions.LOAD_COMPANY_JOBS: {
          return {
            ...adapter.removeAll(featureState),
            companyJobsToAssociate: [],
            loading: true,
            loadingError: false,
            isDetailPanelExpanded: false
          };
        }
        case fromCompanyJobsActions.LOAD_COMPANY_JOBS_SUCCESS: {
          const companyJobGridItems: CompanyJob[] = featureAction.payload.data;
          return {
            ...adapter.setAll(companyJobGridItems, featureState),
            total: featureAction.payload.total,
            loading: false,
            loadingError: false,
            badRequestMessage: ''
          };
        }
        case fromCompanyJobsActions.LOAD_COMPANY_JOBS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true,
            loadingErrorMessage: featureAction.payload
          };
        }
        case fromCompanyJobsActions.LOAD_COMPANY_JOBS_BAD_REQUEST: {
          const emptyResponse: CompanyJob[] = [];
          return {
            ...adapter.setAll(emptyResponse, featureState),
            loading: false,
            badRequestMessage: featureAction.payload
          };
        }
        case fromCompanyJobsActions.RESET: {
          return {
            ...adapter.removeAll(featureState),
            loading: false,
            loadingError: false,
            companyJobsToAssociate: [],
            companyJobIdFilters: [],
            total: 0,
            searchTerm: '',
            isDetailPanelExpanded: false
          };
        }
        case fromCompanyJobsActions.SELECT_COMPANY_JOBS_TO_ASSOCIATE: {
          return {
            ...featureState,
            companyJobsToAssociate: featureAction.payload
          };
        }
        case fromCompanyJobsActions.UPDATE_COMPANY_JOB_ID_FILTERS: {
          return {
            ...featureState,
            companyJobIdFilters: featureAction.payload
          };
        }
        case fromCompanyJobsActions.UPDATE_SEARCH_TERM: {
          return {
            ...featureState,
            searchTerm: featureAction.payload,
            isDetailPanelExpanded: false
          };
        }
        case fromCompanyJobsActions.SELECT_COMPANY_JOB_FOR_DETAIL_PANEL: {
          // close the panel if we're expanded and selecting the same job, otherwise open it
          const isCurrentJobSelected = (featureAction.payload.CompanyJobId === featureState.selectedCompanyJobInDetailPanel.CompanyJobId);
          const isDetailPanelExpanded = !(isCurrentJobSelected && featureState.isDetailPanelExpanded);

          return {
            ...featureState,
            selectedCompanyJobInDetailPanel: featureAction.payload,
            isDetailPanelExpanded,
            downloadingJdmDescriptionError: false
          };
        }
        case fromCompanyJobsActions.TOGGLE_DETAIL_PANEL: {
          return {
            ...featureState,
            isDetailPanelExpanded: !featureState.isDetailPanelExpanded
          };
        }
        case fromCompanyJobsActions.CLOSE_DETAIL_PANEL: {
          return {
            ...featureState,
            isDetailPanelExpanded: false
          };
        }
        case fromCompanyJobsActions.LOAD_JDM_DESCRIPTION_IDS: {
          return {
            ...featureState,
            loadingJdmDescriptionId: true
          };
        }
        case fromCompanyJobsActions.LOAD_JDM_DESCRIPTION_IDS_COMPLETE: {
          return {
            ...featureState,
            loadingJdmDescriptionId: false,
            jdmDescriptionIds: featureAction.payload
          };
        }
        case fromCompanyJobsActions.DOWNLOAD_JDM_DESCRIPTION: {
          return {
            ...featureState,
            downloadingJdmDescription: true,
            downloadingJdmDescriptionError: false
          };
        }
        case fromCompanyJobsActions.DOWNLOAD_JDM_DESCRIPTION_SUCCESS: {
          return {
            ...featureState,
            downloadingJdmDescription: false
          };
        }
        case fromCompanyJobsActions.DOWNLOAD_JDM_DESCRIPTION_ERROR: {
          return {
            ...featureState,
            downloadingJdmDescription: false,
            downloadingJdmDescriptionError: true,
          };
        }
        default: {
          return featureState;
        }
      }
    }, {
      take: 50
    })(state, action);
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
export const getSelectedCompanyJobs = (state: State) => state.companyJobsToAssociate;

// Selector functions, Jdm PDF download
export const getJdmDescriptionIds = (state: State) => state.jdmDescriptionIds;
export const getDownloadingJdmDescription = (state: State) => state.downloadingJdmDescription;
export const getDownloadingJdmDescriptionError = (state: State) => state.downloadingJdmDescriptionError;
