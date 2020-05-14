export interface ExchangeSearchFilterAggregate {
  Id: number;
  ExchangesSearchFilterAggregateId: number;
  SearchFilterAggregateId: number;
  TagCategoryId: number;
  ExchangeId: number;
  DisplayName: string;
  BucketName: string;
  FieldName: string;
  IsDisabled: boolean;
  IsCollapsedByDefault: boolean;
  Ordinal: number;
}

export function generateMockExchangeSearchFilterAggregate(): ExchangeSearchFilterAggregate {
  return {
    Id: 1,
    ExchangesSearchFilterAggregateId: 1,
    SearchFilterAggregateId: 1,
    TagCategoryId: 1,
    ExchangeId: 1,
    DisplayName: 'Display Name',
    BucketName: 'bucket_name',
    FieldName: 'fieldName',
    IsDisabled: true,
    IsCollapsedByDefault: false,
    Ordinal: 1
  };
}
