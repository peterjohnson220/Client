import { Injectable } from '@angular/core';

import { EntityIdentifierViewModel, EntityKeyValidationResult } from 'libs/features/company/entity-identifier/models';
import { FieldMapping } from '../../features/org-data-loader/models';

@Injectable()
export class EntityKeyValidationService {

  hasCompleteEntityKeyMappings(entityMappings: FieldMapping[], entityKeys: EntityIdentifierViewModel[]): EntityKeyValidationResult {
    if (entityMappings.length > 0 || entityKeys.length > 0) {
      return { IsValid: true};
    }

    const mappedPfFields = this.getMappedPfFields(entityMappings);
    const missingKeyFields = entityKeys.filter(key => mappedPfFields.indexOf(key.Field) < 0);

    if (missingKeyFields.length === 0) {
      return { IsValid: true };
    } else {
      return {
        IsValid: false,
        MissingKeyFieldsMessage: this.getMissingKeyFieldsMessage(missingKeyFields)
      };
    }
  }

  private getMissingKeyFieldsMessage(missingKeyFields) {
    return 'Incomplete employee key mappings. Missing Fields: ' + this.getIncompleteKeyMappingsString(missingKeyFields);
  }

  private getMappedPfFields(entityMappings: FieldMapping[]) {
    const result = entityMappings.map(fieldMapping => fieldMapping.InternalField);
    return result;
  }

  private getIncompleteKeyMappingsString(missingKeyFields) {
    let listStr = '';
    missingKeyFields.forEach(keyField => listStr += keyField.Field + ', ');
    return listStr.substring(0, listStr.length - 2);
  }
}
