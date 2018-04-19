import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { ExchangeRequestTypeEnum } from 'libs/models/peer';

import { createExchangeRequestReducer, ExchangeRequestEntityState } from '../exchange-request.reducer';
import { ExchangeJobRequestCandidate } from '../../models';

export interface State extends ExchangeRequestEntityState<ExchangeJobRequestCandidate> { }

export const adapter: EntityAdapter<ExchangeJobRequestCandidate> = createEntityAdapter<ExchangeJobRequestCandidate>({
  selectId: (pfJob: ExchangeJobRequestCandidate) => pfJob.MDJobsBaseId
});

// Reducer
export function reducer(state, action) {
  return createExchangeRequestReducer<ExchangeJobRequestCandidate>(
    ExchangeRequestTypeEnum.PayfactorsJob,
    adapter
  )(state, action);
}
