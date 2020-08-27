import cloneDeep from 'lodash/cloneDeep';

import { TagInformation, Tag } from 'libs/models/peer';

import * as fromTaggingEntitiesActions from '../actions/tagging-entities.actions';

// State
export interface State {
  loading: boolean;
  loadingError: boolean;
  tagInformation: TagInformation[];
  savingTagInformation: boolean;
  savingTagInformationError: boolean;
  addedTags: Tag[];
  removedTags: Tag[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  tagInformation: [],
  savingTagInformation: false,
  savingTagInformationError: false,
  addedTags: [],
  removedTags: []
};

// Reducer
export function reducer(
  featureState = initialState,
  featureAction: fromTaggingEntitiesActions.Actions
): State {
  switch (featureAction.type) {
    case fromTaggingEntitiesActions.LOAD_TAG_INFORMATION: {
      return {
        ...featureState,
        loading: true,
        loadingError: false,
        tagInformation: []
      };
    }
    case fromTaggingEntitiesActions.LOAD_TAG_INFORMATION_SUCCESS: {
      return {
        ...featureState,
        loading: false,
        loadingError: false,
        tagInformation: featureAction.payload
      };
    }
    case fromTaggingEntitiesActions.LOAD_TAG_INFORMATION_ERROR: {
      return {
        ...featureState,
        loading: false,
        loadingError: true
      };
    }
    case fromTaggingEntitiesActions.ADD_TAG: {
      const tagPayload = cloneDeep(featureAction.payload);
      const tagInformationCopy = cloneDeep(featureState.tagInformation);
      const removedTagsCopy = cloneDeep(featureState.removedTags);
      const addedTagsCopy = cloneDeep(featureState.addedTags);
      const relevantTagCategory = tagInformationCopy.filter(tc => tc.TagCategoryId === tagPayload.TagCategoryId)[0];

      // If ID is 0 then the Tag is new.
      const isNewTag = tagPayload.TagId === 0;
      if (isNewTag) {
        // Give the new tag a unique identifier until it is saved.
        tagPayload.TagId = Math.floor((Math.random() * 100000) + 100000);
        // Check if a tag already exists with that name in the collection, if so use that.
        let match = relevantTagCategory.Tags.filter(t => t.Value.toLowerCase() === tagPayload.Value.toLowerCase());
        const existingTag = match.length > 0;
        if (existingTag) {
          match = match[0];
          match.Selected = true;
          let index = removedTagsCopy.findIndex(rtc => rtc.TagId === match.TagId);
          if (index > -1) {
            removedTagsCopy.splice(index, 1);
          } else {
            addedTagsCopy.push(match);
          }
          // Find the match and move to the end of the array of tags.
          index = relevantTagCategory.Tags.findIndex(m => m.TagId === match.TagId);
          relevantTagCategory.Tags.splice(index, 1);
          relevantTagCategory.Tags.push(match);
        } else {
          addedTagsCopy.push(tagPayload);
          relevantTagCategory.Tags.push(tagPayload);
        }
      } else if (!tagPayload.Selected) {
        const updatedTag = relevantTagCategory.Tags.filter(t => t.TagId === tagPayload.TagId)[0];
        updatedTag.Selected = true;
        let index = removedTagsCopy.findIndex(rtc => rtc.TagId === tagPayload.TagId);
        if (index > -1) {
          removedTagsCopy.splice(index, 1);
        } else {
          tagPayload.Selected = true;
          addedTagsCopy.push(tagPayload);
        }
        // Find the updated tag and move it to the end of the array of tags.
        index = relevantTagCategory.Tags.findIndex(ut => ut.TagId === updatedTag.TagId);
        relevantTagCategory.Tags.splice(index, 1);
        relevantTagCategory.Tags.push(updatedTag);
      }

      return {
        ...featureState,
        tagInformation: tagInformationCopy,
        addedTags: addedTagsCopy,
        removedTags: removedTagsCopy
      };
    }
    case fromTaggingEntitiesActions.REMOVE_TAG: {
      const tagPayload = cloneDeep(featureAction.payload);
      const tagInformationCopy = cloneDeep(featureState.tagInformation);
      const removedTagsCopy = cloneDeep(featureState.removedTags);
      const addedTagsCopy = cloneDeep(featureState.addedTags);
      const relevantTagCategory = tagInformationCopy.filter(tc => tc.TagCategoryId === tagPayload.TagCategoryId)[0];

      if (tagPayload.New) {
        let index = relevantTagCategory.Tags.findIndex(t => t.TagId === tagPayload.TagId);
        relevantTagCategory.Tags.splice(index, 1);
        index = addedTagsCopy.findIndex(t => t.TagId === tagPayload.TagId);
        addedTagsCopy.splice(index, 1);
      } else {
        relevantTagCategory.Tags.filter(t => t.TagId === tagPayload.TagId)[0].Selected = false;
        const index = addedTagsCopy.findIndex(t => t.TagId === tagPayload.TagId);
        if (index > -1) {
          addedTagsCopy.splice(index, 1);
        } else {
          tagPayload.Selected = false;
          removedTagsCopy.push(tagPayload);
        }
      }

      return {
        ...featureState,
        tagInformation: tagInformationCopy,
        addedTags: addedTagsCopy,
        removedTags: removedTagsCopy
      };
    }
    case fromTaggingEntitiesActions.SAVE_TAG_INFORMATION: {
      return {
        ...featureState,
        savingTagInformation: true,
        savingTagInformationError: false
      };
    }
    case fromTaggingEntitiesActions.SAVE_TAG_INFORMATION_SUCCESS: {
      return {
        ...featureState,
        savingTagInformation: false,
        savingTagInformationError: false
      };
    }
    case fromTaggingEntitiesActions.SAVE_TAG_INFORMATION_ERROR: {
      return {
        ...featureState,
        savingTagInformation: false,
        savingTagInformationError: true
      };
    }
    default: {
      return featureState;
    }
  }
}

// Selector Functions
export const getTagInformationLoading = (state: State) => state.loading;
export const getTagInformationLoadingError = (state: State) => state.loadingError;
export const getTagInformation = (state: State) => state.tagInformation;
export const getSavingTagInformation = (state: State) => state.savingTagInformation;
export const getSavingTagInformationError = (state: State) => state.savingTagInformationError;
export const getAddedTags = (state: State) => state.addedTags;
export const getRemovedTags = (state: State) => state.removedTags;
