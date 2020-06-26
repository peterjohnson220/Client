import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import { CompanyResourceFolder, CompanyResourceFolderPost, CompanyResource } from '../models';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import * as cloneDeep from 'lodash.clonedeep';


export interface State extends EntityState<CompanyResourceFolder> {
    folderResources: CompanyResourceFolder[];
    companyResourceFolder: CompanyResourceFolderPost;
    addingFolderToCompanyResources: boolean;
    addingFolderToCompanyResourcesSuccess: boolean;
    addingFolderToCompanyResourcesError: any;
    deletingFolderFromCompanyResources: boolean;
    deletingFolderFromCompanyResourcesSuccess: boolean;
  }

  export function sortByFolderId(a: CompanyResourceFolder, b: CompanyResourceFolder): number {
    return b.CompanyResourcesFoldersId - a.CompanyResourcesFoldersId;
  }

  export const adapter: EntityAdapter<CompanyResourceFolder> = createEntityAdapter<CompanyResourceFolder>({
    selectId: (x: CompanyResourceFolder) => x.CompanyResourcesFoldersId,
    sortComparer: sortByFolderId
  });

  const initialState: State = adapter.getInitialState({
    folderResources: null,
    companyResourceFolder: null,
    addingFolderToCompanyResources: null,
    addingFolderToCompanyResourcesSuccess: null,
    addingFolderToCompanyResourcesError: null,
    deletingFolderFromCompanyResources: null,
    deletingFolderFromCompanyResourcesSuccess: null,
  });

  export function reducer(state: State = initialState, action: fromCompanyResourcesPageActions.Actions) {
    switch (action.type) {
      case fromCompanyResourcesPageActions.GETTING_COMPANY_RESOURCES_SUCCESS: {
        return {
          ...adapter.setAll(action.payload.Folders, state)
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_TO_FOLDER_SUCCESS: {
        const resource: CompanyResource = action.payload;
        const folderId = resource.CompanyResourcesFoldersId;
        const updatedEntities = {...state.entities};
        const clonedEntity = cloneDeep(updatedEntities[folderId]);
        clonedEntity.CompanyResources.unshift(resource);
        updatedEntities[folderId] = clonedEntity;
        return {
          ...state,
          entities: updatedEntities
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_AND_FOLDER_SUCCESS: {
        return {
          ...adapter.addOne(action.payload, state)
        };
      }
      case fromCompanyResourcesPageActions.ADDING_FOLDER_TO_COMPANY_RESOURCES: {
        return {
          ...state,
          companyResourceFolder: action.payload,
          addingFolderToCompanyResources: true,
          addingFolderToCompanyResourcesSuccess: false,
          addingFolderToCompanyResourcesError: null
        };
      }
      case fromCompanyResourcesPageActions.ADDING_FOLDER_TO_COMPANY_RESOURCES_SUCCESS: {
        const folder: CompanyResourceFolder = {
            CompanyResourcesFoldersId: action.payload.CompanyResourcesFoldersId,
            CompanyId: action.payload.CompanyId,
            FolderName: action.payload.FolderName,
            CreateDate: action.payload.CreateDate,
            CreateUser: action.payload.CreateUser,
            CompanyResources: []
        };
        return {
          ...adapter.addOne(folder, state),
          addingFolderToCompanyResources: false,
          addingFolderToCompanyResourcesSuccess: true
        };
      }
      case fromCompanyResourcesPageActions.ADDING_FOLDER_TO_COMPANY_RESOURCES_ERROR: {
        return {
          ...state,
          addingFolderToCompanyResources: false,
          addingFolderToCompanyResourcesError: action.payload
        };
      }
      case fromCompanyResourcesPageActions.DELETING_FOLDER_FROM_COMPANY_RESOURCES: {
        return {
          ...state,
          companyResourceId: action.payload,
          deletingFolderFromCompanyResources: true,
          deletingFolderFromCompanyResourcesSuccess: false
        };
      }
      case fromCompanyResourcesPageActions.DELETING_FOLDER_FROM_COMPANY_RESOURCES_SUCCESS: {
        return {
          ...adapter.removeOne(action.payload, state),
          deletingFolderFromCompanyResources: false,
          deletingFolderFromCompanyResourcesSuccess: true
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_SUCCESS: {
        const updatedEntities =  {...state.entities};
        for (const id of state.ids) {
            if (updatedEntities[id] && updatedEntities[id].CompanyResources.length > 0) {
                updatedEntities[id].CompanyResources.forEach((e, index) => {
                    if (e.CompanyResourceId === action.payload) {
                        const clonedResource = cloneDeep(updatedEntities[id]);
                        clonedResource.CompanyResources.splice(index, 1);
                        updatedEntities[id] = clonedResource;
                    }
                });
            }
        }

        return {
            ...state,
            entities: updatedEntities
          };
      }
      default: {
        return state;
      }
    }
  }

  export const getFolderResources = (state: State) => state.folderResources;
  export const getCompanyResourceFolder = (state: State) => state.companyResourceFolder;
  export const getAddingFolderToCompanyResources = (state: State) => state.addingFolderToCompanyResources;
  export const getAddingFolderToCompanyResourcesSuccess = (state: State) => state.addingFolderToCompanyResourcesSuccess;
  export const getAddingFolderToCompanyResourcesError = (state: State) => state.addingFolderToCompanyResourcesError;
  export const getDeletingFolderFromCompanyResources = (state: State) => state.deletingFolderFromCompanyResources;
  export const getDeletingFolderFromCompanyResourcesSuccess = (state: State) => state.deletingFolderFromCompanyResourcesSuccess;
