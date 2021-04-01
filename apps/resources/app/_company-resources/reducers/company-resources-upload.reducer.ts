import cloneDeep from 'lodash/cloneDeep';
import { KendoUploadStatus } from 'libs/models';
import * as companyResourcesAddResourceActions from '../actions/company-resources-add-resource.actions';
import { CompanyResourceUploadState } from '../models/company-resource-upload-state.model';

export interface State {
  companyResourceUploadState: CompanyResourceUploadState;
}

const initialState: State = {
  companyResourceUploadState: null
};

export function reducer(state = initialState, action: companyResourcesAddResourceActions.Actions): State {
  switch (action.type) {
    case companyResourcesAddResourceActions.OPEN_ADD_RESOURCE_MODAL: {
      let entity: CompanyResourceUploadState = cloneDeep(state.companyResourceUploadState);
      if (!entity) {
        entity = {Resources: [], IsModalOpen: true, FolderName: action.folderName};
      } else {
        entity.IsModalOpen = true;
        entity.FolderName = action.folderName;
      }
      return {
        companyResourceUploadState: entity
      };
    }
    case companyResourcesAddResourceActions.CLOSE_ADD_RESOURCE_MODAL: {
      const entity: CompanyResourceUploadState = cloneDeep(state.companyResourceUploadState);
      entity.IsModalOpen = false;
      return {
        companyResourceUploadState: entity
      };
    }
    case companyResourcesAddResourceActions.SAVE_COMPANY_RESOURCES_UPLOAD_STATE: {
      return {
        companyResourceUploadState: action.payload
      };
    }
    case companyResourcesAddResourceActions.CLEAR_COMPANY_RESOURCES_UPLOAD_STATE: {
      const entity: CompanyResourceUploadState = cloneDeep(state.companyResourceUploadState);
      if (entity) {
        entity.Resources = [];
        entity.IsModalOpen = false;
      }
      return {
        companyResourceUploadState: entity
      };
    }
    case companyResourcesAddResourceActions.COMPANY_RESOURCE_SCAN_SUCCESS: {
      const entity: CompanyResourceUploadState = cloneDeep(state.companyResourceUploadState);
      const resource = entity.Resources.find((x) => x.Id === action.attachmentId);
      if (resource) {
        resource.Status = KendoUploadStatus.ScanSucceeded;
      }
      return {
        companyResourceUploadState: entity
      };
    }
    case companyResourcesAddResourceActions.COMPANY_RESOURCE_SCAN_FAILURE: {
      const entity: CompanyResourceUploadState = cloneDeep(state.companyResourceUploadState);
      const resource = entity.Resources.find((x) => x.Id === action.attachmentId);
      if (resource) {
        resource.Status = KendoUploadStatus.ScanFailed;
      }
      return {
        companyResourceUploadState: entity
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyResourceUploadState = (state: State) => cloneDeep(state.companyResourceUploadState);
export const getCompanyResourceAddResourceModalOpen = (state: State) => !state.companyResourceUploadState
? false
: state.companyResourceUploadState.IsModalOpen;
