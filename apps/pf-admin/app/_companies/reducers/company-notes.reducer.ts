import { AsyncStateObjHelper } from 'libs/core';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { CompanyNote } from 'libs/models/payfactors-api';

import * as fromCompanyNotesActions from '../actions/company-notes.actions';

export interface State {
  companyNotes: AsyncStateObj<CompanyNote[]>;
}

export const initialState: State = {
  companyNotes: generateDefaultAsyncStateObj<CompanyNote[]>([])
};

export function reducer(state = initialState, action: fromCompanyNotesActions.Actions): State {
  switch (action.type) {
    case fromCompanyNotesActions.LOAD_COMPANY_NOTES:
      return AsyncStateObjHelper.loading(state, 'companyNotes');
    case fromCompanyNotesActions.LOAD_COMPANY_NOTES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'companyNotes');
    case fromCompanyNotesActions.LOAD_COMPANY_NOTES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'companyNotes', action.payload);
    case fromCompanyNotesActions.SAVE_COMPANY_NOTE:
      return AsyncStateObjHelper.saving(state, 'companyNotes');
    case fromCompanyNotesActions.SAVE_COMPANY_NOTE_ERROR:
      return AsyncStateObjHelper.savingError(state, 'companyNotes');
    case fromCompanyNotesActions.SAVE_COMPANY_NOTE_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'companyNotes');
    case fromCompanyNotesActions.RESET_COMPANY_NOTE_STATE:
        return initialState;
    default:
      return state;
  }
}

export const getNotes = (state: State) => state.companyNotes;
