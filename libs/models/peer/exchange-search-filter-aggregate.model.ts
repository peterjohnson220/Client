export interface ExchangeSearchFilterAggregate {
  ExchangesSearchFilterAggregateId: number;
  SearchFilterAggregateId: number;
  TagCategoryId: number;
  ExchangeId: number;
  DisplayName: string;
  BucketName: string;
  FieldName: string;
  IsDisabled: boolean;
  Ordinal: number;
}

export function generateMockExchangeSearchFilterAggregate(): ExchangeSearchFilterAggregate {
  return {
    ExchangesSearchFilterAggregateId: 1,
    SearchFilterAggregateId: 1,
    TagCategoryId: 1,
    ExchangeId: 1,
    DisplayName: 'Display Name',
    BucketName: 'bucket_name',
    FieldName: 'fieldName',
    IsDisabled: true,
    Ordinal: 1
  };
}
