import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';


import * as fromExistingCompaniesActions from '../../actions/exchange-request/existing-companies.actions';
import { createExchangeRequestReducer } from '../exchange-request.reducer';
import { ExchangeRequestTypeEnum } from '../../actions/exchange-request.actions';


export interface ExistingCompany {
  CompanyId: number;
  CompanyName: string;
  Industry: string;
  Size: number;
  InExchange: boolean;
  Peers: string[];
}

export interface State extends EntityState<ExistingCompany> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<ExistingCompany> = createEntityAdapter<ExistingCompany>({
  selectId: (existingCompany: ExistingCompany) => existingCompany.CompanyId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});
// Reducer
export function reducer(state, action) {
  return createExchangeRequestReducer(
    ExchangeRequestTypeEnum.ReferPayfactorsCompany,
    (featureState = initialState, featureAction: fromExistingCompaniesActions.Actions): State => {
      switch (featureAction.type) {
        case fromExistingCompaniesActions.LOAD_EXISTING_COMPANIES: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExistingCompaniesActions.LOAD_EXISTING_COMPANIES_SUCCESS: {
          const companies: ExistingCompany[] = featureAction.payload;
          return {
            ...adapter.addAll(companies, featureState),
            loading: false
          };
        }
        case fromExistingCompaniesActions.LOAD_EXISTING_COMPANIES_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        default: {
          return featureState;
        }
      }
    })(state, action);
}


// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
