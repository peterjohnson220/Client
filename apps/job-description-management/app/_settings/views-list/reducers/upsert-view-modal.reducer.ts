import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { TemplateListItem } from 'libs/models/jdm';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import { JobDescriptionView } from '../../shared/models';

import * as fromUpsertViewModalActions from '../actions/upsert-view-modal.actions';

export interface State {
  upsertViewModalOpen: boolean;
  upsertingView: boolean;
  upsertingViewError: boolean;
  upsertingViewErrorMessage: string;
  availableTemplatesAsyncObj: AsyncStateObj<TemplateListItem[]>;
  jobDescriptionViews: JobDescriptionView[];
  loadingJobDescriptionViews: boolean;
  loadingJobDescriptionViewsError: boolean;
  assignedTemplateIds: number[];
  editingViewName: string;
}

export const initialState: State = {
  upsertViewModalOpen: false,
  upsertingView: false,
  upsertingViewError: false,
  upsertingViewErrorMessage: '',
  availableTemplatesAsyncObj: generateDefaultAsyncStateObj<TemplateListItem[]>([]),
  loadingJobDescriptionViews: false,
  loadingJobDescriptionViewsError: false,
  jobDescriptionViews: [],
  assignedTemplateIds: [],
  editingViewName: ''
};

export function reducer(state = initialState, action: fromUpsertViewModalActions.Actions): State {
  switch (action.type) {
    case fromUpsertViewModalActions.LOAD_AVAILABLE_TEMPLATES: {
      return AsyncStateObjHelper.loading(state, 'availableTemplatesAsyncObj');
    }
    case fromUpsertViewModalActions.LOAD_AVAILABLE_TEMPLATES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'availableTemplatesAsyncObj', action.payload);
    }
    case fromUpsertViewModalActions.LOAD_AVAILABLE_TEMPLATES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'availableTemplatesAsyncObj');
    }
    case fromUpsertViewModalActions.LOAD_JOB_DESCRIPTION_VIEWS: {
      return {
        ...state,
        loadingJobDescriptionViews: true,
        loadingJobDescriptionViewsError: false
      };
    }
    case fromUpsertViewModalActions.LOAD_JOB_DESCRIPTION_VIEWS_SUCCESS: {
      const updateState = Object.assign({}, state);
      updateState.jobDescriptionViews = action.payload;
      updateState.assignedTemplateIds = updateState.jobDescriptionViews.map(jdv => jdv.TemplateId);
      updateState.loadingJobDescriptionViews = false;
      updateState.loadingJobDescriptionViewsError = false;
      return updateState;
    }
    case fromUpsertViewModalActions.LOAD_JOB_DESCRIPTION_VIEWS_ERROR: {
      return {
        ...state,
        loadingJobDescriptionViews: false,
        loadingJobDescriptionViewsError: true
      };
    }
    case fromUpsertViewModalActions.ADD_VIEW:
      return {
        ...state,
        upsertingView: true,
        upsertingViewError: false
      };
    case fromUpsertViewModalActions.ADD_VIEW_SUCCESS:
      return {
        ...state,
        upsertViewModalOpen: false,
        upsertingView: false,
        upsertingViewError: false
      };
    case fromUpsertViewModalActions.ADD_VIEW_ERROR:
      return {
        ...state,
        upsertingView: false,
        upsertingViewError: true,
        upsertingViewErrorMessage: 'View name is already in use.'
      };
    case fromUpsertViewModalActions.UPDATE_VIEW:
      const newState = Object.assign({}, state);
      const viewName = action.payload.viewName;
      const assignedTemplateIds = action.payload.templateIds;
      const viewId = (state.jobDescriptionViews[0] != null) ? state.jobDescriptionViews[0].Id : null;
      const companyId = (state.jobDescriptionViews[0] != null) ? state.jobDescriptionViews[0].CompanyId : null;

      // Remove any template views that are no longer assigned.
      newState.jobDescriptionViews = newState.jobDescriptionViews
        .filter(jv => assignedTemplateIds.includes(jv.TemplateId));

      // Update all view names.
      newState.jobDescriptionViews = newState.jobDescriptionViews.map(jv => {
        return {
          Id: jv.Id,
          CompanyId: jv.CompanyId,
          Name: viewName,
          TemplateId: jv.TemplateId,
          HiddenElementIds: jv.HiddenElementIds,
          HiddenControlNameElementIds: jv.HiddenControlNameElementIds,
          HiddenSubHeadingElementIds: jv.HiddenSubHeadingElementIds,
          Template: jv.Template,
          JobInformationFields: jv.JobInformationFields ? jv.JobInformationFields : []
        };
      });

      // Add new template view where it does not exist.
      for (const assignedTemplateId of assignedTemplateIds) {
        if (!newState.jobDescriptionViews.some(jv => jv.TemplateId === assignedTemplateId)) {
          newState.jobDescriptionViews.push({
            Id: viewId,
            CompanyId: companyId,
            Name: viewName,
            TemplateId: assignedTemplateId,
            Template: null,
            HiddenElementIds: [],
            HiddenControlNameElementIds: [],
            HiddenSubHeadingElementIds: [],
            JobInformationFields: []
          });
        }
      }

      newState.upsertingView = true;
      newState.upsertingViewError = false;

      return newState;
    case fromUpsertViewModalActions.UPDATE_VIEW_SUCCESS:
      return {
        ...state,
        upsertViewModalOpen: false,
        upsertingView: false,
        upsertingViewError: false
      };
    case fromUpsertViewModalActions.UPDATE_VIEW_ERROR:
      return {
        ...state,
        upsertingView: false,
        upsertingViewError: true,
        upsertingViewErrorMessage: 'View name is already in use.'
      };
    case fromUpsertViewModalActions.OPEN_UPSERT_VIEW_MODAL:
      return {
        ...state,
        upsertViewModalOpen: true
      };
    case fromUpsertViewModalActions.CLOSE_UPSERT_VIEW_MODAL:
      return {
        ...state,
        upsertViewModalOpen: false
      };
    case fromUpsertViewModalActions.SET_EDITING_VIEW_NAME:
      return {
        ...state,
        editingViewName: action.payload.editingViewName
      };
    case fromUpsertViewModalActions.CLEAR_ASSIGNED_TEMPLATES:
      return {
        ...state,
        assignedTemplateIds: []
      };
    default:
      return state;
  }
}

export const getUpsertViewModalOpen = (state: State) => state.upsertViewModalOpen;
export const getAvailableTemplatesAsyncObj = (state: State) => state.availableTemplatesAsyncObj;
export const getUpsertingView = (state: State) => state.upsertingView;
export const getUpsertingViewError = (state: State) => state.upsertingViewError;
export const getUpsertingViewErrorMessage = (state: State) => state.upsertingViewErrorMessage;
export const getJobDescriptionViews = (state: State) => state.jobDescriptionViews;
export const getAssignedTemplateIds = (state: State) => state.assignedTemplateIds;
export const getEditingViewName = (state: State) => state.editingViewName;
