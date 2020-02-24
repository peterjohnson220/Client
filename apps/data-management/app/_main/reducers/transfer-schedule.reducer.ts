import {AsyncStateObjHelper} from 'libs/core/helpers';
import {TransferScheduleSummary, SyncScheduleDtoModel} from 'libs/models/hris-api/sync-schedule';
import {AsyncStateObj, generateDefaultAsyncStateObj} from 'libs/models/state';

import * as fromTransferScheduleActions from '../actions/transfer-schedule.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  transferScheduleSummaries: TransferScheduleSummary[];
  outboundTransferScheduleSummaries: AsyncStateObj<TransferScheduleSummary[]>;
  saving: boolean;
  savingError: boolean;
  savingScheduleId: number;
  savingExpression: string;
  savingActive: boolean;
  savingDtos: SyncScheduleDtoModel[];
  restoreCompleted: boolean;
  showSetupCompleteModal: boolean;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  transferScheduleSummaries: [],
  outboundTransferScheduleSummaries: generateDefaultAsyncStateObj<TransferScheduleSummary[]>([]),
  saving: false,
  savingError: false,
  savingScheduleId: null,
  savingExpression: null,
  savingActive: null,
  savingDtos: [],
  restoreCompleted: false,
  showSetupCompleteModal: false
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
        savingDtos: action.payload.schedules,
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
        transferScheduleSummaries: action.payload.summary,
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
    case fromTransferScheduleActions.SHOW_INTEGRATION_SETUP_COMPLETED_MODAL: {
      return {
        ...state,
        showSetupCompleteModal: action.payload
      };
    }
    case fromTransferScheduleActions.GET_OUTBOUND_TRANSFER_SUMMARY: {
      return AsyncStateObjHelper.loading(state, 'outboundTransferScheduleSummaries');
    }
    case fromTransferScheduleActions.GET_OUTBOUND_TRANSFER_SUMMARY_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'outboundTransferScheduleSummaries', action.payload);
    }
    case fromTransferScheduleActions.SAVE_OUTBOUND_TRANSFER_SCHEDULE: {
      return {
        ...AsyncStateObjHelper.saving(state, 'outboundTransferScheduleSummaries', state.outboundTransferScheduleSummaries.obj),
        savingDtos: [action.payload]
      };
    }
    case fromTransferScheduleActions.SAVE_OUTBOUND_TRANSFER_SCHEDULE_SUCCESS: {
      return {
        ...AsyncStateObjHelper.savingSuccess(state, 'outboundTransferScheduleSummaries',
          Object.assign([], state.outboundTransferScheduleSummaries.obj.map(s => {
            if (s.entityMappingType_ID === action.payload.entityMappingType_ID) {
              return action.payload;
            }
            return s;
          }))),
        savingDtos: []
      };
    }
    case fromTransferScheduleActions.ENABLE_OUTBOUND_TRANSFER_SCHEDULE: {
      return {
        ...AsyncStateObjHelper.savingSuccess(state, 'outboundTransferScheduleSummaries',
          Object.assign([], state.outboundTransferScheduleSummaries.obj.map(s => {
            if (s.syncSchedule_ID === action.payload) {
              return {...s, active: 1};
            }
            return s;
          })))
      };
    }
    case fromTransferScheduleActions.DISABLE_OUTBOUND_TRANSFER_SCHEDULE: {
      return {
        ...AsyncStateObjHelper.savingSuccess(state, 'outboundTransferScheduleSummaries',
          Object.assign([], state.outboundTransferScheduleSummaries.obj.map(s => {
            if (s.syncSchedule_ID === action.payload) {
              return {...s, active: 0};
            }
            return s;
          })))
      };
    }
    case fromTransferScheduleActions.SAVE_ALL_OUTBOUND_TRANSFER_SCHEDULES: {
      return {
        ...AsyncStateObjHelper.savingSuccess(state, 'outboundTransferScheduleSummaries',
          Object.assign([], state.outboundTransferScheduleSummaries.obj.map(s => {
            const p = action.payload.find(x => x.SyncSchedule_ID === s.syncSchedule_ID);
            if (!p) {
              return null;
            }
            return {
              ...s,
              active: p.Active ? 1 : 0,
              expression: p.Expression
            };
          }).filter(s => !!s)))
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
export const getShowSetupCompleteModal = (state: State) => state.showSetupCompleteModal;
export const getOutboundTransferSummaryObj = (state: State) => state.outboundTransferScheduleSummaries;
