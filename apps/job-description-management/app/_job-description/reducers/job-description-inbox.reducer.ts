import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import cloneDeep from 'lodash/cloneDeep';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum, SelectAllStatus } from 'libs/models/common';
import { JobDescriptionInbox } from 'libs/models/payfactors-api';

import * as fromJobDescriptionInboxActions from '../actions/job-description-inbox.actions';

export interface State extends EntityState<JobDescriptionInbox> {
  inboxLoading: boolean;
  inboxLoadingError: boolean;
  inboxCount: number;
  markReadSaving: boolean;
  markUnreadSaving: boolean;
  searchTerm: string;
  selectAllPages: boolean;
  selectAllStatus: string;
  selectedIds: Set<number>;
  unreadInboxCount: number;
  unreadInboxCountError: boolean;
}

export const adapter: EntityAdapter<JobDescriptionInbox> = createEntityAdapter<JobDescriptionInbox>({
  selectId: (jobDescription: JobDescriptionInbox) => jobDescription.CompanyWorkflowStepUserId
});

const initialState: State = adapter.getInitialState({
    inboxLoading: false,
    inboxLoadingError: false,
    inboxCount: 0,
    markReadSaving: false,
    markUnreadSaving: false,
    searchTerm: null,
    selectAllPages: false,
    selectAllStatus: SelectAllStatus.unchecked,
    selectedIds: new Set(),
    unreadInboxCount: 0,
    unreadInboxCountError: false
});

export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.JobDescriptionInbox,
    (featureState: State = initialState, featureAction: fromJobDescriptionInboxActions.JobDescriptionInboxActions): State => {
      switch (featureAction.type) {
        case fromJobDescriptionInboxActions.LOAD_INBOX: {
          return {
            ...featureState,
            inboxLoading: true,
            inboxLoadingError: false
          };
        }
        case fromJobDescriptionInboxActions.LOAD_INBOX_SUCCESS: {
          let selectAllStatus = SelectAllStatus.unchecked;
          const selectedIds = cloneDeep(state.feature.selectedIds);

          if (state.feature.selectAllPages) {
            featureAction.payload.data.forEach(entity => {
              selectedIds.add(entity['CompanyWorkflowStepUserId']);
            });
            selectAllStatus = SelectAllStatus.checked;
          } else if (featureAction.payload.data && featureAction.payload.data.every(entity => selectedIds.has(entity['CompanyWorkflowStepUserId']))) {
            selectAllStatus = SelectAllStatus.checked;
          } else if (featureAction.payload.data && featureAction.payload.data.some(entity => selectedIds.has(entity['CompanyWorkflowStepUserId']))) {
            selectAllStatus = SelectAllStatus.indeterminate;
          }

          return {
            ...adapter.setAll(featureAction.payload.data, featureState),
            inboxCount: featureAction.payload.total,
            inboxLoading: false,
            inboxLoadingError: false,
            selectAllStatus: selectAllStatus,
            selectedIds: selectedIds
          };
        }
        case fromJobDescriptionInboxActions.LOAD_INBOX_ERROR: {
          return {
            ...featureState,
            inboxLoading: false,
            inboxLoadingError: true
          };
        }
        case fromJobDescriptionInboxActions.GET_UNREAD_INBOX_COUNT: {
          return {
            ...featureState,
            unreadInboxCountError: false
          };
        }
        case fromJobDescriptionInboxActions.GET_UNREAD_INBOX_COUNT_SUCCESS: {
          return {
            ...featureState,
            unreadInboxCount: action.payload,
            unreadInboxCountError: false
          };
        }
        case fromJobDescriptionInboxActions.GET_UNREAD_INBOX_COUNT_ERROR: {
          return {
            ...featureState,
            unreadInboxCountError: true
          };
        }
        case fromJobDescriptionInboxActions.SELECT_ALL: {
          const selectAllStatus = state.feature.selectAllStatus === (SelectAllStatus.checked || SelectAllStatus.indeterminate) ?
            SelectAllStatus.unchecked : SelectAllStatus.checked;

          const selectedIds = cloneDeep(state.feature.selectedIds);
          let selectAllPages = cloneDeep(state.feature.selectAllPages);

          if (selectAllStatus === SelectAllStatus.checked) {
            state.feature.ids.forEach(id => {
              selectedIds.add(id);
            });
          } else {
            state.feature.ids.forEach(id => {
              selectedIds.delete(id);
            });
            selectAllPages = false;
          }

          return {
            ...featureState,
            selectAllPages: selectAllPages,
            selectAllStatus: selectAllStatus,
            selectedIds: selectedIds
          };
        }
        case fromJobDescriptionInboxActions.SELECT_ALL_PAGES: {
          return {
            ...featureState,
            selectAllPages: true
          };
        }
        case fromJobDescriptionInboxActions.SELECT_ID: {
          let selectAllStatus = SelectAllStatus.unchecked;
          const selectedIds = cloneDeep(state.feature.selectedIds);
          let selectAllPages = cloneDeep(state.feature.selectAllPages);

          if (selectedIds.has(featureAction.payload) ) {
            selectedIds.delete(featureAction.payload);
          } else {
            selectedIds.add(featureAction.payload);
          }

          if (state.feature.ids && state.feature.ids.every(id => selectedIds.has(id))) {
            selectAllStatus = SelectAllStatus.checked;
            selectAllPages = selectedIds.size === state.feature.inboxCount;
          } else if (selectedIds.size > 0) {
            selectAllStatus = SelectAllStatus.indeterminate;
            selectAllPages = false;
          } else if (selectedIds.size === 0) {
            selectAllStatus = SelectAllStatus.unchecked;
            selectAllPages = false;
          }

          return {
            ...featureState,
            selectAllPages: selectAllPages,
            selectAllStatus: selectAllStatus,
            selectedIds: selectedIds
          };
        }
        case fromJobDescriptionInboxActions.UPDATE_INBOX_READ_ALL: {
          const isMarkRead = action.payload;

          if (isMarkRead) {
            return {
              ...featureState,
              markReadSaving: true
            };
          } else {
            return {
              ...featureState,
              markUnreadSaving: true
            };
          }
        }
        case fromJobDescriptionInboxActions.UPDATE_INBOX_READ_ALL_ERROR: {

          return {
            ...featureState,
            markReadSaving: false,
            markUnreadSaving: false
          };
        }
        case fromJobDescriptionInboxActions.UPDATE_INBOX_READ_ALL_SUCCESS: {

          const selectedIds = cloneDeep(state.feature.selectedIds);

          let selectedEntities: JobDescriptionInbox[] = Object.values(state.feature.entities);
          selectedEntities = selectedEntities.filter(entity => selectedIds.has(entity.CompanyWorkflowStepUserId) && entity.IsRead !== action.payload)
            .map(x => ({...x, IsRead: action.payload}));

          const unreadInboxCount =  action.payload ? 0 : state.feature.inboxCount;

          selectedIds.clear();

          return {
            ...adapter.upsertMany(selectedEntities, featureState),
            markReadSaving: false,
            markUnreadSaving: false,
            selectAllPages: false,
            selectAllStatus: SelectAllStatus.unchecked,
            selectedIds: selectedIds,
            unreadInboxCount: unreadInboxCount
          };
        }
        case fromJobDescriptionInboxActions.UPDATE_INBOX_READ_BULK: {
          const isMarkRead = action.payload;

          if (isMarkRead) {
            return {
              ...featureState,
              markReadSaving: true
            };
          } else {
            return {
              ...featureState,
              markUnreadSaving: true
            };
          }
        }
        case fromJobDescriptionInboxActions.UPDATE_INBOX_READ_BULK_ERROR: {

          return {
            ...featureState,
            markReadSaving: false,
            markUnreadSaving: false
          };
        }
        case fromJobDescriptionInboxActions.UPDATE_INBOX_READ_BULK_SUCCESS: {

          const selectedIds = cloneDeep(state.feature.selectedIds);

          let selectedEntities: JobDescriptionInbox[] = Object.values(state.feature.entities);
          selectedEntities = selectedEntities.filter(entity => selectedIds.has(entity.CompanyWorkflowStepUserId) && entity.IsRead !== action.payload)
            .map(x => ({...x, IsRead: action.payload}));

          const unreadInboxCount =  action.payload ?
          state.feature.unreadInboxCount - selectedIds.size :
          state.feature.unreadInboxCount + selectedIds.size;

          selectedIds.clear();

          return {
            ...adapter.upsertMany(selectedEntities, featureState),
            markReadSaving: false,
            markUnreadSaving: false,
            selectAllPages: false,
            selectAllStatus: SelectAllStatus.unchecked,
            selectedIds: selectedIds,
            unreadInboxCount: unreadInboxCount
          };
        }
        case fromJobDescriptionInboxActions.UNSELECT_ALL: {
          const selectedIds = cloneDeep(state.feature.selectedIds);
          selectedIds.clear();

          return {
            ...featureState,
            selectAllPages: false,
            selectAllStatus: SelectAllStatus.unchecked,
            selectedIds: selectedIds
          };
        }
        default: {
          return featureState;
        }
      }
    }, {
      take: 20
    })(state, action);
}


export const getInboxCount = (state: State) => state.inboxCount;
export const getInboxLoading = (state: State) => state.inboxLoading;
export const getInboxLoadingError = (state: State) => state.inboxLoadingError;
export const getInboxSelectAllPages = (state: State) => state.selectAllPages;
export const getMarkReadSaving = (state: State) => state.markReadSaving;
export const getMarkUnreadSaving = (state: State) => state.markUnreadSaving;
export const getSearchTerm = (state: State) => state.searchTerm;
export const getSelectAllStatus = (state: State) => state.selectAllStatus;
export const getSelectedIds = (state: State) => state.selectedIds;
export const getUnreadInboxCount = (state: State) => state.unreadInboxCount;
export const getUnreadInboxCountError = (state: State) => state.unreadInboxCountError;
