import { StructureRangeGroupResponse } from 'libs/models/payfactors-api/structures';

import { RangeGroupMetadata } from '../models';

export class PayfactorsApiModelMapper {

  static mapStructuresRangeGroupResponseToRangeGroupMetadata(srgr: StructureRangeGroupResponse): RangeGroupMetadata {
    return {
      Currency: srgr.Currency,
      Name: srgr.RangeGroupName,
      Paymarket: srgr.PayMarket,
      Rate: srgr.Rate
    };
  }
}
