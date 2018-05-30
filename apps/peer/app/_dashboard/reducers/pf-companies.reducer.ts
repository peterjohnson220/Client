import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { ExchangeRequestTypeEnum } from 'libs/models/peer';

import { createExchangeRequestReducer, ExchangeRequestEntityState } from '../../shared/reducers/exchange-request.reducer';
import { ExistingCompany } from '../models';

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
