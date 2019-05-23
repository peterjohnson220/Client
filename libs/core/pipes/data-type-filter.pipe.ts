import {Pipe, PipeTransform} from '@angular/core';

import {DataType, RoleDataRestriction} from '../../models/security/roles';

@Pipe({ name: 'dataTypeFilter' })
export class DataTypeFilterPipe  implements PipeTransform {
  constructor() {
  }

  transform(items: RoleDataRestriction[], dataType: DataType): any[] {
    if (!items ) {
      return [];
    }
    if (!dataType || !dataType.DataFields) {
      return items;
    }
    return items.filter(f => dataType.DataFields.map(m => m.Id).indexOf(f.DataFieldId) > -1);
  }
}
