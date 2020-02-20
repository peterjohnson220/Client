export interface AsyncStateObj<T> {
  loading: boolean;
  loadingError: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  obj: T;
}

export function generateDefaultAsyncStateObj<T>(defaultObjValue: T): AsyncStateObj<T> {
  return {
    loading: false,
    loadingError: false,
    saving: false,
    savingSuccess: false,
    savingError: false,
    obj: defaultObjValue
  };
}
