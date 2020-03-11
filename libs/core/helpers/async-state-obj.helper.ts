export class AsyncStateObjHelper {
  static loading(state, propertyName: string) {
    return {
      ...state,
      [propertyName]: { ...state[propertyName], loading: true, loadingError: false }
    };
  }
  static loadingSuccess(state, propertyName: string, payload?: any) {
    return {
      ...state,
      [propertyName]: { ...state[propertyName], loading: false, obj: payload }
    };
  }
  static loadingError(state, propertyName: string, payload?: any) {
    return {
      ...state,
      [propertyName]: { ...state[propertyName], loadingError: true, loading: false, loadingErrorResponse: payload }
    };
  }
  static saving(state, propertyName: string, payload?: any) {
    return {
      ...state,
      [propertyName]: { ...state[propertyName], saving: true, savingSuccess: false, savingError: false, obj: payload }
    };
  }
  static savingSuccess(state, propertyName: string, payload?: any) {
    return {
      ...state,
      [propertyName]: { ...state[propertyName], saving: false, savingSuccess: true, obj: payload }
    };
  }
  static savingError(state, propertyName: string, payload?: any) {
    return {
      ...state,
      [propertyName]: { ...state[propertyName], savingError: true, saving: false, savingSuccess: false, savingErrorResponse: payload }
    };
  }
}
