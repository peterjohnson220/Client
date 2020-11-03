import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import {AsyncStateObjHelper} from 'libs/core/helpers';
import {Template, Statement} from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromTemplateSelectorActions from '../actions/template-selector.actions';


export interface State {
  templates: AsyncStateObj<Template[]>;
  createdStatement: AsyncStateObj<Statement>;
}

export const initialState: State = {
  templates: generateDefaultAsyncStateObj<Template[]>(null),
  createdStatement: generateDefaultAsyncStateObj<Statement>(null)
};

export function reducer(state = initialState, action: fromTemplateSelectorActions.TemplateSelectorActions): State {
  switch (action.type) {
    case fromTemplateSelectorActions.LOAD_TEMPLATES: {
      return AsyncStateObjHelper.loading(state, 'templates');
    }
    case fromTemplateSelectorActions.LOAD_TEMPLATES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'templates', action.payload);
    }
    case fromTemplateSelectorActions.LOAD_TEMPLATES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'templates');
    }
    case fromTemplateSelectorActions.CREATE_STATEMENT: {
      return AsyncStateObjHelper.loading(state, 'createdStatement');
    }
    case fromTemplateSelectorActions.CREATE_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'createdStatement', action.payload);
    }
    case fromTemplateSelectorActions.CREATE_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'createdStatement');
    }
    default: {
      return state;
    }
  }
}
