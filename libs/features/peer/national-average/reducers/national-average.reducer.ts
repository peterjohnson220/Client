import { ExchangeJobDailyNatAvgOrg50thDetails } from 'libs/models/payfactors-api';
import * as fromNationalAverageActions from 'libs/features/peer/national-average/actions/national-average.actions';

export interface State {
  exchangeJobNationalAverages: ExchangeJobDailyNatAvgOrg50thDetails[];
}

const initialState: State = {
  exchangeJobNationalAverages: []
};

export function reducer(state = initialState, action: fromNationalAverageActions.Actions): State {
  switch (action.type) {
    case fromNationalAverageActions.GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS_SUCCESS: {
      return {
        ...state,
        exchangeJobNationalAverages: state.exchangeJobNationalAverages.concat(action.payload)
      };
    }
    default: {
      return state;
    }
  }
}

export const getExchangeJobNationalAverages = (state: State) => state.exchangeJobNationalAverages;
