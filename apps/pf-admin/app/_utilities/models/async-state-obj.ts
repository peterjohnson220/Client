export interface AsyncStateObj<T> {
  loading: boolean;
  loadingError: boolean;
  obj: T;
}

export function generateDefaultAsyncStateObj<T>(): AsyncStateObj<T> {
  return {
    loading: false,
    loadingError: false,
    obj: null
  };
}
