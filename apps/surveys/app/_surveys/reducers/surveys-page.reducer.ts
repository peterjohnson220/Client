import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { SurveyInfoByCompanyDto, SurveyJobDetails } from 'libs/models/survey';
import { SurveyDataCountryAccessDto } from 'libs/models/survey/survey-data-country-access-dto.model';
import { PfDataGridCustomFilterDisplayOptions } from 'libs/features/grids/pf-data-grid/models';

import * as fromSurveysPageActions from '../actions/surveys-page.actions';
import { SurveyDataGrid, SurveysPageConfig } from '../models';

// Define our feature state
export interface State {
  surveyFieldsModalOpen: boolean;
  participantsModalOpen: boolean;
  surveyParticipants: AsyncStateObj<string[]>;
  countries: AsyncStateObj<SurveyDataCountryAccessDto[]>;
  surveyJobDetails: SurveyJobDetails[];
  surveyYears: AsyncStateObj<PfDataGridCustomFilterDisplayOptions[]>;
  openedSurveyDataGrids: SurveyDataGrid[];
  surveyInfo: AsyncStateObj<SurveyInfoByCompanyDto[]>;
}

// Define our initial state
const initialState: State = {
  surveyFieldsModalOpen: false,
  participantsModalOpen: false,
  surveyParticipants: generateDefaultAsyncStateObj<string[]>([]),
  countries: generateDefaultAsyncStateObj([]),
  surveyJobDetails: [],
  surveyYears: generateDefaultAsyncStateObj<PfDataGridCustomFilterDisplayOptions[]>([]),
  openedSurveyDataGrids: [],
  surveyInfo: generateDefaultAsyncStateObj<SurveyInfoByCompanyDto[]>([])
};

// Reducer function
export function reducer(state = initialState, action: fromSurveysPageActions.Actions): State {
  switch (action.type) {
    case fromSurveysPageActions.OPEN_SURVEY_FIELDS_MODAL: {
      return {
        ...state,
        surveyFieldsModalOpen: true
      };
    }
    case fromSurveysPageActions.CLOSE_SURVEY_FIELDS_MODAL: {
      return {
        ...state,
        surveyFieldsModalOpen: false
      };
    }
    case fromSurveysPageActions.OPEN_PARTICIPANTS_MODAL: {
      return {
        ...state,
        participantsModalOpen: true
      };
    }
    case fromSurveysPageActions.CLOSE_PARTICIPANTS_MODAL: {
      return {
        ...state,
        participantsModalOpen: false
      };
    }
    case fromSurveysPageActions.GET_SURVEY_PARTICIPANTS: {
      const surveyParticipantsClone = cloneDeep(state.surveyParticipants);
      surveyParticipantsClone.loading = true;
      return {
        ...state,
        surveyParticipants: surveyParticipantsClone
      };
    }
    case fromSurveysPageActions.GET_SURVEY_PARTICIPANTS_SUCCESS: {
      const surveyParticipantsClone = cloneDeep(state.surveyParticipants);
      surveyParticipantsClone.loading = false;
      surveyParticipantsClone.obj = action.payload;
      return {
        ...state,
        surveyParticipants: surveyParticipantsClone
      };
    }
    case fromSurveysPageActions.GET_SURVEY_PARTICIPANTS_ERROR: {
      const surveyParticipantsClone = cloneDeep(state.surveyParticipants);
      surveyParticipantsClone.loading = false;
      surveyParticipantsClone.loadingError = true;
      return {
        ...state,
        surveyParticipants: surveyParticipantsClone
      };
    }
    case fromSurveysPageActions.GET_SURVEY_COUNTRIES: {
      return AsyncStateObjHelper.loading(state, 'countries');
    }
    case fromSurveysPageActions.GET_SURVEY_COUNTRIES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'countries', action.payload);
    }
    case fromSurveysPageActions.GET_SURVEY_COUNTRIES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'countries');
    }
    case fromSurveysPageActions.GET_SURVEY_YEARS: {
      return AsyncStateObjHelper.loading(state, 'surveyYears');
    }
    case fromSurveysPageActions.GET_SURVEY_YEARS_SUCCESS: {
      let surveyYears = [{ Value: 'Most Recent', Display: 'Most Recent' }];
      surveyYears = surveyYears.concat(action.payload.map(x => ({ Value: x.toString(), Display: x.toString() })));
      return AsyncStateObjHelper.loadingSuccess(state, 'surveyYears', surveyYears);
    }
    case fromSurveysPageActions.GET_SURVEY_YEARS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'surveyYears');
    }
    case fromSurveysPageActions.OPEN_SURVEY_DATA_GRID: {
      const openedSurveyDataGridsClone: SurveyDataGrid[] = cloneDeep(state.openedSurveyDataGrids);
      const gridExists = openedSurveyDataGridsClone.some(x => x.SurveyJobId === action.surveyJobId);
      if (!gridExists) {
        openedSurveyDataGridsClone.push({
          SurveyJobId: action.surveyJobId,
          PageViewId: `${SurveysPageConfig.SurveyDataCutsPageViewId}_${action.surveyJobId}`,
          GridRefreshed: true,
          Reloading: false
        });
      }
      return {
        ...state,
        openedSurveyDataGrids: openedSurveyDataGridsClone
      };
    }
    case fromSurveysPageActions.RESET_OPENED_SURVEY_DATA_GRIDS: {
      return {
        ...state,
        openedSurveyDataGrids: []
      };
    }
    case fromSurveysPageActions.UPDATE_SURVEY_DATA_GRID_FIELDS: {
      const openedSurveyDataGridsClone: SurveyDataGrid[] = cloneDeep(state.openedSurveyDataGrids);
      openedSurveyDataGridsClone.forEach(grid => {
        if (grid.SurveyJobId !== action.surveyJobId) {
          grid.GridRefreshed = false;
        }
      });
      return {
        ...state,
        openedSurveyDataGrids: openedSurveyDataGridsClone
      };
    }
    case fromSurveysPageActions.RELOAD_SURVEY_DATA_GRID: {
      const openedSurveyDataGridsClone: SurveyDataGrid[] = cloneDeep(state.openedSurveyDataGrids);
      const updatedGrid = openedSurveyDataGridsClone.find(x => x.SurveyJobId === action.surveyJobId);
      if (updatedGrid) {
        updatedGrid.GridRefreshed = true;
        updatedGrid.Reloading = true;
      }
      return {
        ...state,
        openedSurveyDataGrids: openedSurveyDataGridsClone
      };
    }
    case fromSurveysPageActions.RELOAD_SURVEY_DATA_GRID_SUCCESS: {
      const openedSurveyDataGridsClone: SurveyDataGrid[] = cloneDeep(state.openedSurveyDataGrids);
      const updatedGrid = openedSurveyDataGridsClone.find(x => x.SurveyJobId === action.surveyJobId);
      if (updatedGrid) {
        updatedGrid.Reloading = false;
      }
      return {
        ...state,
        openedSurveyDataGrids: openedSurveyDataGridsClone
      };
    }
    case fromSurveysPageActions.GET_SURVEY_INFO: {
      return AsyncStateObjHelper.loading(state, 'surveyInfo');
    }
    case fromSurveysPageActions.GET_SURVEY_INFO_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'surveyInfo', action.payload);
    }
    case fromSurveysPageActions.GET_SURVEY_INFO_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'surveyInfo');
    }
    case fromSurveysPageActions.GET_SURVEY_JOB_DETAILS_SUCCESS: {
      const surveyJobDetailsClone: SurveyJobDetails[] = cloneDeep(state.surveyJobDetails);
      surveyJobDetailsClone.push(action.payload);
      return {
        ...state,
        surveyJobDetails: surveyJobDetailsClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getSurveyFieldsModalOpen = (state: State) => state.surveyFieldsModalOpen;
export const getParticipantsModalOpen = (state: State) => state.participantsModalOpen;
export const getSurveyParticipants = (state: State) => state.surveyParticipants;
export const getSurveyCountries = (state: State) => state.countries;
export const getSurveyYears = (state: State) => state.surveyYears;
export const getOpenedSurveyDataGrids = (state: State) => state.openedSurveyDataGrids;
export const getSurveyInfo = (state: State) => state.surveyInfo;
export const getSurveyJobDetails = (state: State) => state.surveyJobDetails;
