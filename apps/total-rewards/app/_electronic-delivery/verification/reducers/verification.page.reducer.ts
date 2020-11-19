import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { EmployeeRewardsData, TokenStatus } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromActions from '../actions/verification.page.actions';

export interface State {
  employeeData: EmployeeRewardsData;
  statement: Statement;
  tokenStatus: AsyncStateObj<TokenStatus>;
  isValidating: boolean;
  resent: boolean;
  lockedUntil: Date;
  notificationsToken: string;
  downloadingPdf: boolean;
  downloadPdfError: boolean;
}

export const initialState: State = {
  statement: null,
  employeeData: null,
  tokenStatus: generateDefaultAsyncStateObj<TokenStatus>(null),
  isValidating: false,
  resent: false,
  lockedUntil: null,
  notificationsToken: null,
  downloadingPdf: false,
  downloadPdfError: false
};

export function reducer(state = initialState, action: fromActions.VerificationPageActions): State {
  switch (action.type) {
    case fromActions.REQUEST_TOKEN: {
      const localState: State = cloneDeep(state);

      return AsyncStateObjHelper.loading(localState, 'tokenStatus');
    }
    case fromActions.REQUEST_TOKEN_SUCCESS: {
      const tokenStatus = cloneDeep(state.tokenStatus);
      tokenStatus.loading = false;
      tokenStatus.obj = action.payload.tokenStatus;

      return {
        ...state,
        tokenStatus: tokenStatus,
        resent: action.payload.resent,
        lockedUntil: action.payload.lockedUntil
      };
    }
    case fromActions.REQUEST_TOKEN_ERROR: {
      const localState: State = cloneDeep(state);

      return AsyncStateObjHelper.loadingError(localState, 'tokenStatus');
    }
    case fromActions.VALIDATE_TOKEN: {
      const tokenStatus = cloneDeep(state.tokenStatus);
      tokenStatus.loading = true;
      return {
        ...state,
        tokenStatus: tokenStatus,
        isValidating: true
      };
    }
    case fromActions.VALIDATE_TOKEN_SUCCESS: {
      const tokenStatus = cloneDeep(state.tokenStatus);
      tokenStatus.obj = action.payload.Status;
      tokenStatus.loading = false;
      return {
        ...state,
        tokenStatus: tokenStatus,
        statement: action.payload.Statement,
        employeeData: action.payload.EmployeeData,
        isValidating: false,
        lockedUntil: action.payload.LockedUntil,
        notificationsToken: action.payload.NotificationsToken
      };
    }
    case fromActions.START_DOWNLOAD_PDF: {
      return {
        ...state,
        downloadingPdf: true,
        downloadPdfError: false
      };
    }
    case fromActions.DOWNLOAD_PDF_ERROR:
    case fromActions.START_DOWNLOAD_PDF_ERROR: {
      return {
        ...state,
        downloadingPdf: false,
        downloadPdfError: true
      };
    }
    case fromActions.DOWNLOAD_PDF_SUCCESS: {
      return {
        ...state,
        downloadingPdf: false,
        downloadPdfError: false
      };
    }
    case fromActions.VALIDATE_TOKEN_ERROR: {
      const localState: State = cloneDeep(state);

      return AsyncStateObjHelper.loadingError(localState, 'tokenStatus');
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getEmployeeData = (state: State) => state.employeeData;
export const getStatement = (state: State) => state.statement;
export const getTokenStatusAsync = (state: State) => state.tokenStatus;
export const getIsValidating = (state: State) => state.isValidating;
export const getResent = (state: State) => state.resent;
export const getLockedUntil = (state: State) => state.lockedUntil;
export const getNotificationsToken = (state: State) => state.notificationsToken;
export const getDownloadingPdf = (state: State) => state.downloadingPdf;
export const getDownloadPdfError = (state: State) => state.downloadPdfError;
