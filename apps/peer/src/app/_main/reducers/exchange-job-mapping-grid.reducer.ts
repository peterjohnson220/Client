import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobMapping } from 'libs/models/peer';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromExchangeJobMappingGridActions from '../actions/exchange-job-mapping-grid.actions';

export interface State extends EntityState<ExchangeJobMapping> {
  loading: boolean;
  loadingError: boolean;
  total: number;
  selectedMapping: ExchangeJobMapping;
  pageRowIndexToScrollTo: number;
}

export const adapter: EntityAdapter<ExchangeJobMapping> = createEntityAdapter<ExchangeJobMapping>({
  selectId: (exchangeJobMapping: ExchangeJobMapping) => exchangeJobMapping.ExchangeJobId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0,
  selectedMapping: null,
  pageRowIndexToScrollTo: null
});


// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeJobMapping,
    (featureState = initialState,  featureAction: fromExchangeJobMappingGridActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS_AFTER_MAP: {
          return {
            ...featureState,
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS_SUCCESS: {
          const exchangeJobMappings: ExchangeJobMapping[] = featureAction.payload.data.map(d => {
            return {
              ExchangeJobId: d.exchange_job_id,
              ExchangeId: d.exchange_id,
              CompanyId: d.company_job_mappings ? d.company_job_mappings.company_id : null,
              ExchangeJobCode: d.exchange_job_code,
              ExchangeJobTitle: d.exchange_job_title,
              CompanyJobCode: d.company_job_mappings ? d.company_job_mappings.company_job_code : null,
              CompanyJobTitle: d.company_job_mappings ? d.company_job_mappings.company_job_title : null,
              CompanyJobLevel: d.company_job_mappings ? d.company_job_mappings.company_job_level : null,
              ExchangeJobFamily: d.exchange_job_family,
              ExchangeJobLevel: d.exchange_job_level,
              CompanyJobFamily: d.company_job_mappings ? d.company_job_mappings.company_job_family : null,
              CompanyJobDescription: d.company_job_mappings ? d.company_job_mappings.company_job_description : null,
              ExchangeJobDescription: d.exchange_job_description,
              Mapped: d.company_job_mappings ? d.company_job_mappings.mapped : null,
              // TODO: We are going to need ExchangeJobToCompanyJobId in the index
              ExchangeJobToCompanyJobId: 345
            };
          });
          return {
            ...adapter.addAll(exchangeJobMappings, featureState),
            total: featureAction.payload.total,
            loading: false
          };
        }
        case fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromExchangeJobMappingGridActions.SELECT_EXCHANGE_JOB_MAPPING: {
          return {
            ...featureState,
            selectedMapping: featureAction.payload
          };
        }
        case fromExchangeJobMappingGridActions.RESELECT_EXCHANGE_JOB_MAPPING: {
          return {
            ...featureState,
            selectedMapping: findSelectedJobMapping(Object.values(featureState.entities), featureState.selectedMapping)
          };
        }
        case fromExchangeJobMappingGridActions.UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO: {
          return {
            ...featureState,
            pageRowIndexToScrollTo: featureAction.payload
          };
        }
        default: {
          return featureState;
        }
      }
    }, {take: 20})(state, action);
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
export const getSelectedMapping = (state: State) => state.selectedMapping;
export const getPageRowIndexToScrollTo = (state: State) => state.pageRowIndexToScrollTo;


// Helper functions
function findSelectedJobMapping(exchangeJobMappings: ExchangeJobMapping[], selectedJobMapping: ExchangeJobMapping) {
  if (!selectedJobMapping) { return null; }

  return exchangeJobMappings.find(ejm => ejm.ExchangeJobId === selectedJobMapping.ExchangeJobId);
}
