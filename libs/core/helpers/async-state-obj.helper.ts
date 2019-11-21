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
  static loadingError(state, propertyName: string) {
    return {
      ...state,
      [propertyName]: { ...state[propertyName], loadingError: true, loading: false }
    };
  }
}
