import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { orderBy, cloneDeep, zipObject, map, keyBy } from 'lodash';

import { getValueForSortByProperty } from 'libs/core/functions';

import * as fromTicketListActions from '../actions/ticket-list.actions';
import { UserTicketGridItem } from '../models';

// Extended entity state
export interface State extends EntityState<UserTicketGridItem> {
  initSuccess: boolean;
  loading: boolean;
  loadingError: boolean;
  dirty: boolean;
  unfilteredList: UserTicketGridItem[];
}

// Create entity adapter
export const adapter: EntityAdapter<UserTicketGridItem> = createEntityAdapter<UserTicketGridItem>({
    selectId: (userTicketViewModel: UserTicketGridItem) => userTicketViewModel.Id
});

// Initial State
export const initialState: State = adapter.getInitialState({
  initSuccess: false,
  loading: true,
  loadingError: false,
  dirty: false,
  unfilteredList: [],
});

export function reducer(state = initialState, action: fromTicketListActions.Actions): State {
  switch (action.type) {
    case fromTicketListActions.INIT_TICKETS_SUCCESS: {
      return {
        ...state,
        initSuccess: true
      };
    }
    case fromTicketListActions.LOAD_TICKETS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromTicketListActions.LOAD_TICKETS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false,
        dirty: false,
        unfilteredList: action.payload
      };
    }
    case fromTicketListActions.LOAD_TICKETS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTicketListActions.SET_GRID_DIRTY_STATUS: {
      return {
        ...state,
        dirty: action.payload
      };
    }
    case fromTicketListActions.SORT_TICKETS: {
      let ticketIds = state.ids;
      let sortedTicketList;

      if (action.payload.dir) {
        sortedTicketList = orderBy(cloneDeep(state.entities),
          [ticket => getValueForSortByProperty(ticket, action.payload.field)],
          [action.payload.dir]);
        ticketIds = map(sortedTicketList, 'Id');
      } else {
        ticketIds = map(state.unfilteredList, 'Id');
        sortedTicketList = cloneDeep(state.unfilteredList);
      }

      return {
        ...state,
        entities: zipObject(ticketIds, sortedTicketList),
        ids: ticketIds,
      };
    }
    default: {
      return state;
    }
  }
}

export const getInitSuccess = (state: State) => state.initSuccess;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getDirtyGridState = (state: State) => state.dirty;
