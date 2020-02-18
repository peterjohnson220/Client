import * as fromModalActions from '../actions/modal.actions';

export interface State {
  isOpen: boolean;
  isOpenError: boolean;
  pageWorkflowIndex: number;
  pageWorkflow: string[];
  modalTitle: string;
  modalTitlePrefix: string;
}

const initialState: State = {
  isOpen: false,
  isOpenError: false,
  pageWorkflowIndex: -1,
  pageWorkflow: null,
  modalTitle: '',
  modalTitlePrefix: ''
};

export function reducer(state = initialState, action: fromModalActions.Actions): State {
  switch (action.type) {

    case fromModalActions.OPEN_ADD_JOBS_MODAL: {
      return {
        ...state,
        isOpen: true,
        isOpenError: false,
        pageWorkflow: action.pageWorkflow,
        modalTitlePrefix: trimSpecial(action.modalTitlePrefix)
      };
    }
    case fromModalActions.OPEN_ADD_JOBS_MODAL_ERROR: {
      return {
        ...state,
        isOpen: false,
        isOpenError: true,
        pageWorkflow: null
      };
    }
    case fromModalActions.CLOSE_ADD_JOBS_MODAL: {
      return {
        ...state,
        isOpen: false,
        isOpenError: false,
        pageWorkflow: null
      };
    }
    case fromModalActions.CHANGE_PAGE: {
      const newStaticPageWorkflowIndex = (!!state.pageWorkflow && !!action.page) ? state.pageWorkflow.indexOf(action.page) : -1;
      const nextPageWorkflowIndex = (newStaticPageWorkflowIndex > -1) ? newStaticPageWorkflowIndex :
        (!!nextPage(state)) ? state.pageWorkflowIndex + 1 : -1;

      const newModalTitle = getNewTitle(state, nextPageWorkflowIndex);

      return {
        ...state,
        pageWorkflowIndex: nextPageWorkflowIndex,
        modalTitle: newModalTitle || ''
      };
    }
    case fromModalActions.SET_MODAL_TITLE: {
      return {
        ...state,
        modalTitle: action.payload
      };
    }
    default: {
      return state;
    }
  }
}


// Selector functions
export const getAddJobsModalIsOpen = (state: State) => state.isOpen;
export const getAddJobsModalIsWorkflow = (state: State) => !!state.pageWorkflow;
export const getCurrentPage = (state: State) => currentPage(state);
export const getHasNextPage = (state: State) => !!nextPage(state);
export const getNextPage = (state: State) => nextPage(state);
export const getModalTitle = (state: State) => state.modalTitle;

const currentPage = (state: State, pageIndex: number = state.pageWorkflowIndex): string =>
  (getAddJobsModalIsWorkflow(state) && pageIndex > -1 && pageIndex < state.pageWorkflow.length)
    ? state.pageWorkflow[pageIndex] : null;

const nextPage = (state: State): string => currentPage(state, state.pageWorkflowIndex + 1);

const getNewTitle = (state: State, pageIndex: number): string =>
  (state.modalTitlePrefix)
    ? `${(state.modalTitlePrefix) ? state.modalTitlePrefix : ''}
      ${currentPage(state, pageIndex) ? '- ' : ''}${trimSpecial(currentPage(state, pageIndex)) || ''}`
    : `${(currentPage(state, pageIndex) ? trimSpecial(currentPage(state, pageIndex)) : null) || null}`;

const trimSpecial = (value: string) => value.replace(/[^a-zA-Z ]/g, '').trim();
