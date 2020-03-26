import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as fromOrgDataEmailRecipientsActions from '../actions/email-recipients.actions';
import { ConfigurationGroup, EmailRecipientModel } from 'libs/models/data-loads';

export interface State extends EntityState<EmailRecipientModel> {
  loading: boolean;
  loadingError: boolean;
  saving: boolean;
  savingError: boolean;
  removing: boolean;
  removingError: boolean;
  emailRecipientsModalOpen: boolean;
  createdConfigurationGroup: ConfigurationGroup;
}

export const adapter: EntityAdapter<EmailRecipientModel> = createEntityAdapter<EmailRecipientModel>({
  selectId: (x: EmailRecipientModel) =>
    x.DataLoadEmailRecipientId
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  saving: false,
  savingError: false,
  removing: false,
  removingError: false,
  emailRecipientsModalOpen: false,
  createdConfigurationGroup: null
});

export function reducer(
  state = initialState,
  action: fromOrgDataEmailRecipientsActions.Actions
): State {
  switch (action.type) {
    case fromOrgDataEmailRecipientsActions.LOAD_EMAIL_RECIPIENTS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromOrgDataEmailRecipientsActions.LOAD_EMAIL_RECIPIENTS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false,
      };
    }
    case fromOrgDataEmailRecipientsActions.LOAD_EMAIL_RECIPIENTS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromOrgDataEmailRecipientsActions.SAVING_EMAIL_RECIPIENT: {
      return {
        ...state,
        saving: true,
        savingError: false
      };
    }
    case fromOrgDataEmailRecipientsActions.SAVING_EMAIL_RECIPIENT_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
        saving: false,
      };
    }
    case fromOrgDataEmailRecipientsActions.SAVING_EMAIL_RECIPIENT_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    case fromOrgDataEmailRecipientsActions.REMOVING_EMAIL_RECIPIENT: {
      return {
        ...state,
        removing: true,
        removingError: false
      };
    }
    case fromOrgDataEmailRecipientsActions.REMOVING_EMAIL_RECIPIENT_SUCCESS: {
      return {
        ...adapter.removeOne(action.payload.DataLoadEmailRecipientId, state),
        removing: false
      };
    }
    case fromOrgDataEmailRecipientsActions.REMOVING_EMAIL_RECIPIENT_ERROR: {
      return {
        ...state,
        removing: false,
        removingError: true
      };
    }
    case fromOrgDataEmailRecipientsActions.OPEN_EMAIL_RECIPIENTS_MODAL: {
      return {
        ...state,
        emailRecipientsModalOpen: true
      };
    }
    case fromOrgDataEmailRecipientsActions.CLOSE_EMAIL_RECIPIENTS_MODAL: {
      return {
        ...state,
        emailRecipientsModalOpen: false
      };
    }
    case fromOrgDataEmailRecipientsActions.SET_CREATED_CONFIGURATION_GROUP: {
      return {
        ...state,
        createdConfigurationGroup: action.configurationGroup
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingEmailRecipients = (state: State) => state.loading;
export const getLoadingEmailRecipientsError = (state: State) => state.loadingError;

export const getSavingEmailRecipients = (state: State) => state.saving;
export const getSavingEmailRecipientsError = (state: State) => state.savingError;

export const getRemovingEmailRecipients = (state: State) => state.removing;
export const getRemovingEmailRecipientsError = (state: State) => state.removingError;

export const getEmailRecipientsModalOpen = (state: State) => state.emailRecipientsModalOpen;

export const getCreatedConfigurationGroup = (state: State) => state.createdConfigurationGroup;
