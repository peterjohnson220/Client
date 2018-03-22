import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { ExchangeRequestTypeEnum, ExistingCompany } from 'libs/models/peer';

import { createExchangeRequestReducer, ExchangeRequestEntityState } from '../exchange-request.reducer';

export interface State extends ExchangeRequestEntityState<ExistingCompany> { }

export const adapter: EntityAdapter<ExistingCompany> = createEntityAdapter<ExistingCompany>({
  selectId: (existingCompany: ExistingCompany) => existingCompany.CompanyId
});

// Reducer
export function reducer(state, action) {
  return createExchangeRequestReducer<ExistingCompany>(
    ExchangeRequestTypeEnum.ReferPayfactorsCompany,
    adapter
  )(state, action);
}

// Selector functions
