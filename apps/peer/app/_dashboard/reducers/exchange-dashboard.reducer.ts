import { ChartItem, ExchangeJobComparison } from 'libs/models';
import {ExchangeChartTypeEnum} from 'libs/models/peer/exchange-chart-type.enum';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';

export interface State {
  loadingCompanyChart: boolean;
  loadingCompanyChartError: boolean;
  companyChartItems: ChartItem[];
  loadingJobChart: boolean;
  loadingJobChartError: boolean;
  jobChartItems: ChartItem[];
  loadingIndustryChart: boolean;
  loadingIndustryChartError: boolean;
  industryChartItems: ChartItem[];
  loadingJobFamilyChart: boolean;
  loadingJobFamilyChartError: boolean;
  jobFamilyChartItems: ChartItem[];
  loadingRevenueChart: boolean;
  loadingRevenueChartError: boolean;
  revenueChartItems: ChartItem[];
  detailChartCategory: string;
  detailChartType: string;
  loadingDetailChart: boolean;
  loadingDetailChartError: boolean;
  detailChartItems: ChartItem[];
  sidebarVisible: boolean;
  mapHasDataItem: boolean;
  loadingMapHasData: boolean;
  loadingMapHasDataError: boolean;
  }

// Initial State
export const initialState: State = {
  loadingCompanyChart: false,
  loadingCompanyChartError: false,
  companyChartItems: null,
  loadingJobChart: false,
  loadingJobChartError: false,
  jobChartItems: null,
  loadingIndustryChart: false,
  loadingIndustryChartError: false,
  industryChartItems: null,
  loadingJobFamilyChart: false,
  loadingJobFamilyChartError: false,
  jobFamilyChartItems: null,
  loadingRevenueChart: false,
  loadingRevenueChartError: false,
  revenueChartItems: null,
  detailChartCategory: null,
  detailChartType: null,
  loadingDetailChart: false,
  loadingDetailChartError: false,
  detailChartItems: null,
  sidebarVisible: false,
  mapHasDataItem: false,
  loadingMapHasData: false,
  loadingMapHasDataError: false
  };

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeDashboardActions.Actions
): State {
  switch (action.type) {
    case fromExchangeDashboardActions.LOAD_COMPANY_CHART: {
      return {
        ...state,
        companyChartItems: null,
        loadingCompanyChart: true,
        loadingCompanyChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_COMPANY_CHART_SUCCESS: {
      return {
        ...state,
        companyChartItems: action.payload,
        loadingCompanyChart: false,
        loadingCompanyChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_COMPANY_CHART_ERROR: {
      return {
        ...state,
        loadingCompanyChart: false,
        loadingCompanyChartError: true
      };
    }
    case fromExchangeDashboardActions.LOAD_JOB_CHART: {
      return {
        ...state,
        jobChartItems: null,
        loadingJobChart: true,
        loadingJobChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_JOB_CHART_SUCCESS: {
      return {
        ...state,
        jobChartItems: action.payload,
        loadingJobChart: false,
        loadingJobChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_JOB_CHART_ERROR: {
      return {
        ...state,
        loadingJobChart: false,
        loadingJobChartError: true
      };
    }
    case fromExchangeDashboardActions.LOAD_INDUSTRY_CHART: {
      return {
        ...state,
        industryChartItems: null,
        loadingIndustryChart: true,
        loadingIndustryChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_INDUSTRY_CHART_SUCCESS: {
      return {
        ...state,
        industryChartItems: action.payload,
        loadingIndustryChart: false,
        loadingIndustryChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_INDUSTRY_CHART_ERROR: {
      return {
        ...state,
        loadingIndustryChart: false,
        loadingIndustryChartError: true
      };
    }
    case fromExchangeDashboardActions.LOAD_JOB_FAMILY_CHART: {
      return {
        ...state,
        jobFamilyChartItems: null,
        loadingJobFamilyChart: true,
        loadingJobFamilyChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_JOB_FAMILY_CHART_SUCCESS: {
      return {
        ...state,
        jobFamilyChartItems: action.payload,
        loadingJobFamilyChart: false,
        loadingJobFamilyChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_JOB_FAMILY_CHART_ERROR: {
      return {
        ...state,
        loadingJobFamilyChart: false,
        loadingJobFamilyChartError: true
      };
    }
    case fromExchangeDashboardActions.LOAD_REVENUE_CHART: {
      return {
        ...state,
        revenueChartItems: null,
        loadingRevenueChart: true,
        loadingRevenueChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_REVENUE_CHART_SUCCESS: {
      return {
        ...state,
        revenueChartItems: action.payload,
        loadingRevenueChart: false,
        loadingRevenueChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_REVENUE_CHART_ERROR: {
      return {
        ...state,
        loadingRevenueChart: false,
        loadingRevenueChartError: true
      };
    }
    case fromExchangeDashboardActions.LOAD_DETAIL_CHART: {
      return {
        ...state,
        detailChartType: action.payload.ChartType,
        detailChartCategory: action.payload.Category,
        sidebarVisible: true,
        detailChartItems: null,
        loadingDetailChart: true,
        loadingDetailChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_DETAIL_CHART_SUCCESS: {
      return {
        ...state,
        detailChartItems: action.payload,
        loadingDetailChart: false,
        loadingDetailChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_DETAIL_CHART_ERROR: {
      return {
        ...state,
        loadingDetailChart: false,
        loadingDetailChartError: true
      };
    }
    case fromExchangeDashboardActions.CLOSE_SIDEBAR: {
      return {
        ...state,
        sidebarVisible: false,
        detailChartItems: null,
        loadingDetailChart: false,
        loadingDetailChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_MAP_COUNT: {
      return {
        ...state,
        mapHasDataItem: false,
        loadingMapHasData: true,
        loadingMapHasDataError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_MAP_COUNT_SUCCESS: {
      return {
        ...state,
        mapHasDataItem: action.payload,
        loadingMapHasData: false,
        loadingMapHasDataError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_MAP_COUNT_ERROR: {
      return {
        ...state,
        mapHasDataItem : false,
        loadingMapHasData: false,
        loadingMapHasDataError: true
      };
    }
    case fromExchangeDashboardActions.LOAD_EXCHANGE_JOB_ORGS: {
      const payload: ExchangeJobComparison = action.payload.selectedExchangeJobComparison;
      return {
        ...state,
        detailChartType: ExchangeChartTypeEnum.ExchangeJobOrgs,
        detailChartCategory: payload.ExchangeJobTitle,
        sidebarVisible: true,
        detailChartItems: null,
        loadingDetailChart: true,
        loadingDetailChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_EXCHANGE_JOB_ORGS_SUCCESS: {
      const exchangeJobMappings: ChartItem[] = action.payload.map(org => ({Category: org}) as ChartItem);
      return {
        ...state,
        detailChartItems: exchangeJobMappings,
        loadingDetailChart: false,
        loadingDetailChartError: false
      };
    }
    case fromExchangeDashboardActions.LOAD_EXCHANGE_JOB_ORGS_ERROR: {
      return {
        ...state,
        loadingDetailChart: false,
        loadingDetailChartError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getCompanyChartItems = (state: State) => state.companyChartItems;
export const getLoadingCompanyChart = (state: State) => state.loadingCompanyChart;
export const getLoadingCompanyChartError = (state: State) => state.loadingCompanyChartError;
export const getJobChartItems = (state: State) => state.jobChartItems;
export const getLoadingJobChart = (state: State) => state.loadingJobChart;
export const getLoadingJobChartError = (state: State) => state.loadingJobChartError;
export const getIndustryChartItems = (state: State) => state.industryChartItems;
export const getLoadingIndustryChart = (state: State) => state.loadingIndustryChart;
export const getLoadingIndustryChartError = (state: State) => state.loadingIndustryChartError;
export const getJobFamilyChartItems = (state: State) => state.jobFamilyChartItems;
export const getLoadingJobFamilyChart = (state: State) => state.loadingJobFamilyChart;
export const getLoadingJobFamilyChartError = (state: State) => state.loadingJobFamilyChartError;
export const getRevenueChartItems = (state: State) => state.revenueChartItems;
export const getLoadingRevenueChart = (state: State) => state.loadingRevenueChart;
export const getLoadingRevenueChartError = (state: State) => state.loadingRevenueChartError;
export const getDetailChartType = (state: State) => state.detailChartType;
export const getDetailChartCategory = (state: State) => state.detailChartCategory;
export const getDetailChartItems = (state: State) => state.detailChartItems;
export const getLoadingDetailChart = (state: State) => state.loadingDetailChart;
export const getLoadingDetailChartError = (state: State) => state.loadingDetailChartError;
export const getSidebarVisible = (state: State) => state.sidebarVisible;
export const getMapHasDataItem = (state: State) => state.mapHasDataItem;
export const getLoadingMapHasData = (state: State) => state.loadingMapHasData;
export const getLoadingMapHasDataError = (state: State) => state.loadingMapHasDataError;
