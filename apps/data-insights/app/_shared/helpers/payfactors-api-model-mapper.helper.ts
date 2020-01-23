import { DataViewEntityResponse } from 'libs/models/payfactors-api/reports/response';

import { Entity } from '../models';

export class PayfactorsApiModelMapper {

  /// IN
  static mapDataViewEntityResponsesToEntities(response: DataViewEntityResponse[]): Entity[] {
    return response.map(e => {
      return {
        Id: e.EntityId,
        Name: e.Entity,
        IsBaseEntity: e.IsBaseEntity
      };
    });
  }

}
