import { ExchangeInvitation } from 'libs/models/peer';

import * as fromCompanyExchangeInvitationInfoActions from '../actions/company-exchange-invitation-info.actions';

export interface State {
  approving: boolean;
  approvingError: boolean;
  denying: boolean;
  denyingError: boolean;
  companyInvitationInfoOpen: boolean;
  selectedCompanyInvitation: ExchangeInvitation;
  pageRowIndex: number;
}

const initialState: State = {
  approving: false,
  approvingError: false,
  denying: false,
  denyingError: false,
  companyInvitationInfoOpen: false,
  selectedCompanyInvitation: null,
  pageRowIndex: null
};

export function reducer(
  state = initialState,
  action: fromCompanyExchangeInvitationInfoActions.Actions
): State {
  switch (action.type) {
    case fromCompanyExchangeInvitationInfoActions.APPROVE_COMPANY_EXCHANGE_INVITATION: {
      return {
        ...state,
        approving: true,
        approvingError: false,
        denying: false,
        denyingError: false
      };
    }
    case fromCompanyExchangeInvitationInfoActions.APPROVE_COMPANY_EXCHANGE_INVITATION_SUCCESS: {
      return {
        ...state,
        approving: false,
        approvingError: false,
        companyInvitationInfoOpen: false,
        selectedCompanyInvitation: null,
        pageRowIndex: null
      };
    }
    case fromCompanyExchangeInvitationInfoActions.APPROVE_COMPANY_EXCHANGE_INVITATION_ERROR: {
      return {
        ...state,
        approving: false,
        approvingError: true
      };
    }
    case fromCompanyExchangeInvitationInfoActions.DENY_COMPANY_EXCHANGE_INVITATION: {
      return {
        ...state,
        denying: true,
        denyingError: false,
        approving: false,
        approvingError: false
      };
    }
    case fromCompanyExchangeInvitationInfoActions.DENY_COMPANY_EXCHANGE_INVITATION_SUCCESS: {
      return {
        ...state,
        denying: false,
        denyingError: false,
        companyInvitationInfoOpen: false,
        selectedCompanyInvitation: null,
        pageRowIndex: null
      };
    }
    case fromCompanyExchangeInvitationInfoActions.DENY_COMPANY_EXCHANGE_INVITATION_ERROR: {
      return {
        ...state,
        denying: false,
        denyingError: true
      };
    }
    case fromCompanyExchangeInvitationInfoActions.OPEN_COMPANY_INVITATION_INFO: {
      return {
        ...state,
        companyInvitationInfoOpen: true,
        approvingError: false,
        denyingError: false,
        selectedCompanyInvitation: action.payload.selectedCompanyInvitation,
        pageRowIndex: action.payload.pageRowIndex
      };
    }
    case fromCompanyExchangeInvitationInfoActions.CLOSE_COMPANY_INVITATION_INFO: {
      return {
        ...state,
        companyInvitationInfoOpen: false,
        approvingError: false,
        denyingError: false,
        selectedCompanyInvitation: null,
        pageRowIndex: null
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getApproving = (state: State) => state.approving;
export const getApprovingError = (state: State) => state.approvingError;
export const getDenying = (state: State) => state.denying;
export const getDenyingError = (state: State) => state.denyingError;
export const getJobRequestInfoOpen = (state: State) => state.companyInvitationInfoOpen;
export const getSelectedJobRequest = (state: State) => state.selectedCompanyInvitation;
export const getPageRowIndex = (state: State) => state.pageRowIndex;
