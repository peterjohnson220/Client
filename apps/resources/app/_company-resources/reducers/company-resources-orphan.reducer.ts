import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import { OrphanedCompanyResource } from '../models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';


export interface State extends EntityState<OrphanedCompanyResource> {
    orphanedResources: OrphanedCompanyResource[];
  }

  export function sortByResourceId(a: OrphanedCompanyResource, b: OrphanedCompanyResource): number {
    return b.CompanyResourceId - a.CompanyResourceId;
  }

  export const adapter: EntityAdapter<OrphanedCompanyResource> = createEntityAdapter<OrphanedCompanyResource>({
    selectId: (x: OrphanedCompanyResource) => x.CompanyResourceId,
    sortComparer: sortByResourceId
  });

  const initialState: State = adapter.getInitialState({
    orphanedResources: null
  });

  export function reducer(state: State = initialState, action: fromCompanyResourcesPageActions.Actions) {
    switch (action.type) {
      case fromCompanyResourcesPageActions.GETTING_COMPANY_RESOURCES_SUCCESS: {
        return {
          ...adapter.addAll(action.payload.OrphanedCompanyResources, state)
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_ORPHAN_SUCCESS: {
        return {
          ...adapter.addOne(action.payload, state)
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_SUCCESS: {
        const updatedEntities =  {...state.entities};
        for (const id of state.ids) {
            if (updatedEntities[id].CompanyResourceId === action.payload) {
                return {
                    ...adapter.removeOne(action.payload, state)
                };
            }
        }
        return {
            ...state
        };
      }
      default: {
        return state;
      }
    }
  }

  export const getOrphanedResources = (state: State) => state.orphanedResources;
