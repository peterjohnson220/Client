import { DataViewFilter } from 'libs/models/payfactors-api';

export class PayMarketAssociationsHelper {
  static getPayMarketFilters(entitySourceName: string, payMarketId: number): DataViewFilter[] {
    return [
      {
        EntitySourceName: entitySourceName,
        SourceName: 'CompanyPayMarket_ID',
        Operator: '=',
        Values: [payMarketId?.toString()]
      }
    ];
  }
}
