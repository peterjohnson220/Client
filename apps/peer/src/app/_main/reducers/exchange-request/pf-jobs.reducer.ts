import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { ExchangeRequestTypeEnum } from 'libs/models/peer';

import { createExchangeRequestReducer, ExchangeRequestEntityState } from '../exchange-request.reducer';
import { PayfactorsJob } from '../../models';

export interface State extends ExchangeRequestEntityState<PayfactorsJob> { }

export const adapter: EntityAdapter<PayfactorsJob> = createEntityAdapter<PayfactorsJob>({
  selectId: (pfJob: PayfactorsJob) => pfJob.MDJobsBaseId
});

// Reducer
export function reducer(state, action) {
  return createExchangeRequestReducer<PayfactorsJob>(
    ExchangeRequestTypeEnum.PayfactorsJob,
    adapter
  )(state, action);
}

// Selector functions
