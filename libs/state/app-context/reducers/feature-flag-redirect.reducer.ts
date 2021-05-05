import { AsyncStateObj, generateDefaultAsyncStateObj } from '../../../models/state';
import { PageRedirectUrl } from '../../../models/url-redirect/page-redirect-url';
import * as fromFeatureFlagRedirectActions from '../actions/feature-flag-redirect.action';
import { AsyncStateObjHelper } from '../../../core/helpers';
import { UrlPage } from '../../../models/url-redirect/url-page';

export interface State {
  redirectUrls: AsyncStateObj<PageRedirectUrl[]>;
}

export const initialState: State = {
  redirectUrls: generateDefaultAsyncStateObj<PageRedirectUrl[]>([])
};

export function reducer(state = initialState, action: fromFeatureFlagRedirectActions.Actions): State {
  switch (action.type) {
    case fromFeatureFlagRedirectActions.GET_USER_REDIRECT_URLS:
      return AsyncStateObjHelper.loading(state, 'redirectUrls');
    case fromFeatureFlagRedirectActions.GET_USER_REDIRECT_URLS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'redirectUrls', action.payload);
    case fromFeatureFlagRedirectActions.GET_USER_REDIRECT_URLS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'redirectUrls', action.payload);
    default:
      return state;
  }
}

export const getFeatureFlagUrls = (state: State) => state.redirectUrls.obj;
export const getLoading = (state: State) => state.redirectUrls.loading;
export const getLoadingError = (state: State) => state.redirectUrls.loadingError;
export const getPageRedirectUrl = (state: State, page: UrlPage) => state.redirectUrls.obj.find(x => x.TargetPage === page);
