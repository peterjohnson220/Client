import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { CompanyBaseInformation } from 'libs/models/company';

import * as fromPeerExchangeSignupActions from '../actions/peer-exchange-signup.actions';

export interface State {
  exchangeSignupCompaniesAsyncObj: AsyncStateObj<CompanyBaseInformation[]>;
}

const initialState: State = {
  exchangeSignupCompaniesAsyncObj: generateDefaultAsyncStateObj<CompanyBaseInformation[]>([]),
};

export function reducer(state = initialState, action: fromPeerExchangeSignupActions.PeerExchangeSignupActions): State {
  switch (action.type) {
    case fromPeerExchangeSignupActions.GET_EXCHANGE_SIGNUP_COMPANIES:
      return AsyncStateObjHelper.loading(state, 'exchangeSignupCompaniesAsyncObj');
    case fromPeerExchangeSignupActions.GET_EXCHANGE_SIGNUP_COMPANIES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'exchangeSignupCompaniesAsyncObj', action.payload.exchangeSignupCompanies);
    case fromPeerExchangeSignupActions.GET_EXCHANGE_SIGNUP_COMPANIES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'exchangeSignupCompaniesAsyncObj');
    default:
      return state;
  }
}

export const getExchangeSignupCompaniesAsyncObj = (state: State) => state.exchangeSignupCompaniesAsyncObj;
