import * as fromSurveyActions from '../actions/survey-actions';

export interface State {
    isMapCompaniesModalOpen: boolean;
    isCopySurveyModalOpen: boolean;
    isDeleteConfirmationModalOpen: boolean;
    mapCompaniesModalData: any;
    isLoadingMapModalData: boolean;
    getMapModalDataFailed: boolean;
    isAddSurveyModalOpen: boolean;
    isLoadingSurveyData: boolean;
    surveyLoadFailed: boolean;
    shouldRefreshGrid: boolean;
    surveyData: any;
}

export const initialState: State = {
    isMapCompaniesModalOpen: false,
    isCopySurveyModalOpen: false,
    isDeleteConfirmationModalOpen: false,
    mapCompaniesModalData: {},
    isLoadingMapModalData: false,
    getMapModalDataFailed: false,
    isAddSurveyModalOpen: false,
    isLoadingSurveyData: false,
    surveyLoadFailed: false,
    shouldRefreshGrid: false,
    surveyData: []
};

export function reducer(state = initialState, action: fromSurveyActions.Actions): State {
    switch (action.type) {
        case fromSurveyActions.SET_MAP_COMPANIES_MODAL_OPEN: {
            return {
                ...state,
                isMapCompaniesModalOpen: action.isOpen
            };
        }
        case fromSurveyActions.SET_COPY_SURVEY_MODAL_OPEN: {
            return {
                ...state,
                isCopySurveyModalOpen: action.isOpen
            };
        }
        case fromSurveyActions.SET_DELETE_CONFIRMATION_MODAL_OPEN: {
            return {
                ...state,
                isDeleteConfirmationModalOpen: action.isOpen
            };
        }
        case fromSurveyActions.GET_MAP_COMPANIES_MODAL_DATA: {
            return {
                ...state,
                mapCompaniesModalData: {},
                isLoadingMapModalData: true,
                getMapModalDataFailed: false
            };
        }
        case fromSurveyActions.GET_MAP_COMPANIES_MODAL_DATA_SUCCESS: {
            return {
                ...state,
                mapCompaniesModalData: action.mapModalData,
                isLoadingMapModalData: false,
                getMapModalDataFailed: false
            };
        }

        case fromSurveyActions.GET_MAP_COMPANIES_MODAL_DATA_FAILED: {
            return {
                ...state,
                mapCompaniesModalData: {},
                isLoadingMapModalData: false,
                getMapModalDataFailed: true
            };
        }

        case fromSurveyActions.SET_ADD_SURVEY_MODAL_OPEN: {
            return {
                ...state,
                isAddSurveyModalOpen: action.isOpen
            };
        }
        case fromSurveyActions.GET_SURVEY_DATA: {
            return {
                ...state,
                isLoadingSurveyData: true,
                surveyLoadFailed: false,
                shouldRefreshGrid: false
            };
        }
        case fromSurveyActions.GET_SURVEY_DATA_SUCCESS: {
            return {
                ...state,
                surveyData: action.payload,
                isLoadingSurveyData: false,
                surveyLoadFailed: false,
                shouldRefreshGrid: false
            };
        }
        case fromSurveyActions.GET_SURVEY_DATA_FAILED: {
            return {
                ...state,
                surveyData: [],
                isLoadingSurveyData: false,
                surveyLoadFailed: true,
                shouldRefreshGrid: false
            };
        }
        case fromSurveyActions.SHOULD_REFRESH_GRID: {
            return {
                ...state,
                shouldRefreshGrid: action.shouldRefresh
            };
        }
        default:
            return state;
    }
}

export const isMapCompaniesModalOpen = (state: State) => state.isMapCompaniesModalOpen;
export const isCopySurveyModalOpen = (state: State) => state.isCopySurveyModalOpen;
export const isDeleteConfirmationModalOpen = (state: State) => state.isDeleteConfirmationModalOpen;
export const mapCompaniesModalData = (state: State) => state.mapCompaniesModalData;
export const isLoadingMapModalData = (state: State) => state.isLoadingMapModalData;
export const getMapModalDataFailed = (state: State) => state.getMapModalDataFailed;
export const isAddSurveyModalOpen = (state: State) => state.isAddSurveyModalOpen;
export const getSurveyData = (state: State) => state.surveyData;
export const isLoadingSurveyData = (state: State) => state.isLoadingSurveyData;
export const shouldRefreshGrid = (state: State) => state.shouldRefreshGrid;
export const surveyLoadFailed = (state: State) => state.surveyLoadFailed;
