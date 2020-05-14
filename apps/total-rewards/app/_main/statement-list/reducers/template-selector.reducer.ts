import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import {AsyncStateObjHelper} from '../../../../../../libs/core/helpers';

import * as fromTemplateSelectorActions from '../actions/template-selector.actions';
import {Template} from '../../../shared/models';


export interface State {
  templates: AsyncStateObj<Template[]>;
}

export const initialState: State = {
  templates: generateDefaultAsyncStateObj<Template[]>(null)
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
    default: {
      return state;
    }
  }
}
