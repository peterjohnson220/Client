import * as cloneDeep from 'lodash.clonedeep';
import * as isEqual from 'lodash.isequal';

import { FilterOptions } from '../models/filter-options.model';
import * as fromCommunityPostFilterOptionsActions from '../actions/community-post-filter-options.actions';
import { mapCommunityTagToTag } from '../helpers/model-mapping.helper';
import { initializeFilterOptions } from '../helpers/model-mapping.helper';

export interface State {
  filterOptions: FilterOptions;
  addingCommunityTag: boolean;
  addingCommunityCategory: boolean;
  addingCommunityIndustry: boolean;
  addingCommunityCompanySize: boolean;
  filterByPost: boolean;
}

export const initialState: State = {
  filterOptions: initializeFilterOptions(),
  addingCommunityTag: false,
  addingCommunityCategory: false,
  addingCommunityIndustry: false,
  addingCommunityCompanySize: false,
  filterByPost: false
};

export function reducer(state = initialState, action: fromCommunityPostFilterOptionsActions.Actions): State {
  switch (action.type) {
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS: {
      const newTag = action.payload;
      const currentEntities = cloneDeep(state.filterOptions);

      if (currentEntities.TagFilter.Tags.length === 0) {
        currentEntities.TagFilter.Tags.push(newTag);
      } else {
        const exists = currentEntities.TagFilter.Tags.filter(tag => isEqual(tag.TagName, newTag.TagName));
        if (exists.length === 0) {
          currentEntities.TagFilter.Tags.push(newTag);
        }
      }
      return {
        ...state,
        addingCommunityTag: true,
        filterOptions: currentEntities
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS_SUCCESS: {

      return {
        ...state,
        addingCommunityTag: false
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS: {
      const newCateogry = action.payload;
      const currentEntities = cloneDeep(state.filterOptions);

      if (currentEntities.CategoryFilter.Category.length === 0) {
        currentEntities.CategoryFilter.Category.push(newCateogry);
      } else {
        const exists = currentEntities.CategoryFilter.Category.filter(category => isEqual(category, newCateogry));
        if (exists.length === 0) {
          currentEntities.CategoryFilter.Category.push(newCateogry);
        }
      }
      return {
        ...state,
        addingCommunityCategory: true,
        filterOptions: currentEntities
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS_SUCCESS: {

      return {
        ...state,
        addingCommunityCategory: false
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_INDUSTRY_TO_FILTER_OPTIONS: {
      const newIndustry = action.payload;
      const currentEntities = cloneDeep(state.filterOptions);

      if (currentEntities.IndustryFilter.Industry.length === 0) {
        currentEntities.IndustryFilter.Industry.push(newIndustry);
      } else {
        const exists = currentEntities.IndustryFilter.Industry.filter(industry => isEqual(industry, newIndustry));
        if (exists.length === 0) {
          currentEntities.IndustryFilter.Industry.push(newIndustry);
        }
      }
      return {
        ...state,
        addingCommunityIndustry: true,
        filterOptions: currentEntities
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_INDUSTRY_TO_FILTER_OPTIONS_SUCCESS: {
      return {
        ...state,
        addingCommunityIndustry: false
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_COMPANY_SIZE_TO_FILTER_OPTIONS: {
      const newCompanySize = action.payload;
      const currentEntities = cloneDeep(state.filterOptions);

      if (currentEntities.CompanySizeFilter.CompanySize.length === 0) {
        currentEntities.CompanySizeFilter.CompanySize.push(newCompanySize);
      } else {
        const exists = currentEntities.CompanySizeFilter.CompanySize.filter(size => isEqual(size, newCompanySize));
        if (exists.length === 0) {
          currentEntities.CompanySizeFilter.CompanySize.push(newCompanySize);
        }
      }
      return {
        ...state,
        addingCommunityCompanySize: true,
        filterOptions: currentEntities
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_COMPANY_SIZE_TO_FILTER_OPTIONS_SUCCESS: {
      return {
        ...state,
        addingCommunityCompanySize: false
      };
    }
    case fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_TAG_FROM_FILTER_OPTIONS: {
      const removeTag = action.payload;
      const currentEntities = cloneDeep(state.filterOptions);

      const filters = currentEntities.TagFilter;
      if (filters) {
        filters.Tags = filters.Tags.filter(tag => !isEqual(tag.TagName, removeTag.TagName));
      }
      return {
        ...state,
        filterOptions: currentEntities
      };
    }
    case fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_CATEGORY_FROM_FILTER_OPTIONS: {
      const removeCategory = action.payload;
      const currentEntities = cloneDeep(state.filterOptions);

      const filters = currentEntities.CategoryFilter;
      if (filters) {
        filters.Category = filters.Category.filter(category => !isEqual(category, removeCategory));
      }

      return {
        ...state,
        filterOptions: currentEntities
      };
    }
    case fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_INDUSTRY_FROM_FILTER_OPTIONS: {
      const removeIndustry = action.payload;
      const currentEntities = cloneDeep(state.filterOptions);

      const filters = currentEntities.IndustryFilter;
      if (filters) {
        filters.Industry = filters.Industry.filter(industry => !isEqual(industry, removeIndustry));
      }

      return {
        ...state,
        filterOptions: currentEntities
      };
    }
    case fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_COMPANY_SIZE_FROM_FILTER_OPTIONS: {
      const removeCompanySize = action.payload;
      const currentEntities = cloneDeep(state.filterOptions);

      const filters = currentEntities.CompanySizeFilter;
      if (filters) {
        filters.CompanySize = filters.CompanySize.filter(size => !isEqual(size, removeCompanySize));
      }

      return {
        ...state,
        filterOptions: currentEntities
      };
    }
    case fromCommunityPostFilterOptionsActions.DELETING_ALL_FILTER_OPTIONS: {
      const filter = initializeFilterOptions();
      return {
        ...state,
        filterOptions: filter,
        filterByPost: false
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_POST_TO_FILTER_OPTIONS: {
      const postId = action.payload;
      const filter = cloneDeep(state.filterOptions);
      filter.PostIds.push(postId);
      return {
        ...state,
        filterOptions: filter,
        filterByPost: true
      };
    }
    case fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_POST_REPLY_TO_FILTER_OPTIONS: {
      const replyId = action.payload;
      const filter = cloneDeep(state.filterOptions);
      filter.ReplyIds.push(replyId);
      return {
        ...state,
        filterOptions: filter,
        filterByPost: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getCommunityPostFilterOptions = (state: State ) => state.filterOptions;
export const getFilteredByPost = (state: State ) => state.filterByPost;
