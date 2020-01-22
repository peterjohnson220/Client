import {TransferScheduleSummary, SyncScheduleDtoModel} from 'libs/models/hris-api/sync-schedule';

import * as fromTransferScheduleActions from '../actions/transfer-schedule.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  transferScheduleSummaries: TransferScheduleSummary[];
  saving: boolean;
  savingError: boolean;
  savingScheduleId: number;
  savingExpression: string;
  savingActive: boolean;
  savingDtos: SyncScheduleDtoModel[];
  restoreCompleted: boolean;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  transferScheduleSummaries: [],
  saving: false,
  savingError: false,
  savingScheduleId: null,
  savingExpression: null,
  savingActive: null,
  savingDtos: [],
  restoreCompleted: false
};

export function reducer(state: State = initialState, action: fromTransferScheduleActions.Actions) {
  switch (action.type) {
    case fromTransferScheduleActions.GET_TRANSFER_SUMMARY: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        restoreCompleted: false,
      };
    }
    case fromTransferScheduleActions.GET_TRANSFER_SUMMARY_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTransferScheduleActions.GET_TRANSFER_SUMMARY_SUCCESS: {
      return {
        ...state,
        loading: false,
        transferScheduleSummaries: action.payload
      };
    }
    case fromTransferScheduleActions.DISABLE_TRANSFER_SCHEDULE: {
      return {
        ...state,
        saving: true,
        savingError: false,
        savingScheduleId: action.payload
      };
    }
    case fromTransferScheduleActions.DISABLE_TRANSFER_SCHEDULE_ERROR:
    case fromTransferScheduleActions.ENABLE_TRANSFER_SCHEDULE_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true,
        savingScheduleId: null
      };
    }
    case fromTransferScheduleActions.ENABLE_TRANSFER_SCHEDULE_SUCCESS:
    case fromTransferScheduleActions.DISABLE_TRANSFER_SCHEDULE_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingError: false,
        savingScheduleId: null
      };
    }
    case fromTransferScheduleActions.ENABLE_TRANSFER_SCHEDULE: {
      return {
        ...state,
        saving: true,
        savingError: false,
        savingScheduleId: action.payload
      };
    }
    case fromTransferScheduleActions.SAVE_TRANSFER_SCHEDULE: {
      return {
        ...state,
        saving: true,
        savingError: false,
        savingDtos: [action.payload]
      };
    }
    case fromTransferScheduleActions.SAVE_ALL_TRANSFER_SCHEDULES: {
      return {
        ...state,
        saving: true,
        savingError: false,
        savingDtos: action.payload,
        restoreCompleted: false
      };
    }
    case fromTransferScheduleActions.SAVE_TRANSFER_SCHEDULE_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingError: false,
        savingDtos: [],
        transferScheduleSummaries: Object.assign([], state.transferScheduleSummaries.map(s => {
            if (s.entityMappingType_ID === action.payload.entityMappingType_ID) {
              return action.payload;
            }
            return s;
        }))
      };
    }
    case fromTransferScheduleActions.SAVE_ALL_TRANSFER_SCHEDULES_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingError: false,
        savingDtos: [],
        transferScheduleSummaries: action.payload,
        restoreCompleted: true
      };
    }
    case fromTransferScheduleActions.SAVE_TRANSFER_SCHEDULE_ERROR:
    case fromTransferScheduleActions.SAVE_ALL_TRANSFER_SCHEDULES_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true,
        savingDtos: []
      };
    }
    default:
      return state;
  }
}

export const getTransferScheduleSummary = (state: State) => state.transferScheduleSummaries;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getSaving = (state: State) => state.saving;
export const getSavingError = (state: State) => state.savingError;
export const getSavingScheduleId = (state: State) => state.savingScheduleId;
export const getRestoreCompleted = (state: State) => state.restoreCompleted;
