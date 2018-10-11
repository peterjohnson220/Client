export interface GenericKeyValue<TKey, TValue> {
  Key: TKey;
  Value: TValue;
}

export function generateMockGenericKeyValue<TKey, TValue>(key: TKey, value: TValue): GenericKeyValue<TKey, TValue> {
  return {
    Key: key,
    Value: value
  };
}
