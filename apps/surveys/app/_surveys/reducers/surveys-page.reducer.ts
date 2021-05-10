import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { SurveyCountryDto } from 'libs/models/survey/survey-country-dto.model';
import { PfDataGridCustomFilterDisplayOptions } from 'libs/features/grids/pf-data-grid/models';

import * as fromSurveysPageActions from '../actions/surveys-page.actions';

// Define our feature state
export interface State {
  surveyFieldsModalOpen: boolean;
  participantsModalOpen: boolean;
  surveyParticipants: AsyncStateObj<string[]>;
  countries: AsyncStateObj<SurveyCountryDto[]>;
  surveyYears: AsyncStateObj<PfDataGridCustomFilterDisplayOptions[]>;
}

// Define our initial state
const initialState: State = {
  surveyFieldsModalOpen: false,
  participantsModalOpen: false,
  surveyParticipants: generateDefaultAsyncStateObj<string[]>([]),
  countries: generateDefaultAsyncStateObj([]),
  surveyYears: generateDefaultAsyncStateObj<PfDataGridCustomFilterDisplayOptions[]>([])
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
