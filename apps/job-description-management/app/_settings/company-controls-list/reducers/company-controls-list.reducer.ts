import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { ControlType } from 'libs/models';

import * as fromCompanyControlsListActions from '../actions/company-controls-list.actions';

export interface State {
  companyControlsObj: AsyncStateObj<ControlType[]>;
}

export const initialState: State = {
  companyControlsObj: generateDefaultAsyncStateObj<ControlType[]>([])
};

export function reducer(state = initialState, action: fromCompanyControlsListActions.Actions): State {
  switch (action.type) {
    case fromCompanyControlsListActions.LOAD_COMPANY_CONTROLS: {
      return AsyncStateObjHelper.loading(state, 'companyControlsObj');
    }
    case fromCompanyControlsListActions.LOAD_COMPANY_CONTROLS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'companyControlsObj', action.payload);
    }
    case fromCompanyControlsListActions.LOAD_COMPANY_CONTROLS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'companyControlsObj');
    }
    default: {
      return state;
    }
  }
}

export const getAvailableCompanyControls = (state: State) => state.companyControlsObj;
