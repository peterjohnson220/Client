export interface AsyncStateObj<T> {
  loading: boolean;
  loadingError: boolean;
  loadingErrorResponse: any;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  savingErrorResponse: any;
  obj: T;
  previousPricingEffectiveDate: any;
}

export function generateDefaultAsyncStateObj<T>(defaultObjValue: T): AsyncStateObj<T> {
  return {
    loading: false,
    loadingError: false,
    loadingErrorResponse: null,
    saving: false,
    savingSuccess: false,
    savingError: false,
    savingErrorResponse: null,
    obj: defaultObjValue,
    previousPricingEffectiveDate: null
  };
}
