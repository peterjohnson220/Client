import * as fromLoaderSettingsActions from 'libs/features/loaders/org-data-loader/actions/loader-settings.actions';
import { LoaderSetting } from 'libs/models/data-loads';

import { OrgDataFilenamePatternSetFactory } from '../helpers/org-data-filename-pattern-set-factory';
import { OrgDataFilenamePatternSet } from '../models';

export interface State {
  OrgDataFilenamePatternSet: OrgDataFilenamePatternSet;
}

const factory = new OrgDataFilenamePatternSetFactory();

export const initialState: State = {
  OrgDataFilenamePatternSet: factory.getConvention()
};

function getState(currentState: State, settings: LoaderSetting[]): State {
  if (settings == null) {
    return currentState;
  }

  return {
    OrgDataFilenamePatternSet: factory.create(settings)
  };
}

export function reducer(
  state = initialState,
  action: fromLoaderSettingsActions.Actions
): State {
  switch (action.type) {
    case fromLoaderSettingsActions.LOADING_LOADER_SETTINGS_SUCCESS: {
      return getState(state, action.payload);
    }
    default: {
      return state;
    }
  }
}

export const getOrgDataFilenamePatternSet = (state: State) => state.OrgDataFilenamePatternSet;
