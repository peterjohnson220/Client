import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as communityCategoryActions from '../actions/community-categories.actions';
import { CommunityCategory } from 'libs/models/community/community-categories.model';

export interface State extends EntityState<CommunityCategory> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<CommunityCategory> = createEntityAdapter<CommunityCategory>({
  selectId: (communityCategory: CommunityCategory) => communityCategory.Name
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

export function reducer(
  state = initialState,
  action: communityCategoryActions.Actions
): State {
  switch (action.type) {

    case communityCategoryActions.GETTING_COMMUNITY_CATEGORIES: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case communityCategoryActions.GETTING_COMMUNITY_CATEGORIES_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loading: false
      };
    }
    case communityCategoryActions.GETTING_COMMUNITY_CATEGORIES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityCategoryActions.ADDING_COMMUNITY_POST_TO_CATEGORIES_COUNT: {

      const communityCategory = action.payload['communityCategory'];
      const entity = state.entities[communityCategory];
      const updatedCount = entity.Count + 1;
​
      return {
        ...adapter.updateOne(
          { id: communityCategory, changes: { Count: updatedCount } },
          state)
      };
    }
    case communityCategoryActions.SUBTRACTING_COMMUNITY_POST_TO_CATEGORIES_COUNT: {

      const communityCategory = action.payload['communityCategory'];
      const entity = state.entities[communityCategory];
      const updatedCount = entity.Count - 1;
​
      return {
        ...adapter.updateOne(
          { id: communityCategory, changes: { Count: updatedCount } },
          state)
      };
    }
    default: {
      return state;
    }
  }
}
export const getGettingCommunityCategories = (state: State) => state.loading;
export const getGettingCommunityCategoriesError = (state: State) => state.loadingError;

