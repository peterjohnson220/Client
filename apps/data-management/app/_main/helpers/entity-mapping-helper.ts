import { EntityField, EntityDataField } from '../models';

export class EntityMappingHelper {
  static addAssocaitionToProviderEntity(entityType: string, entity: EntityDataField, providerFields: EntityField): EntityField {
    const pfEntityDataFields: EntityDataField[] = providerFields[entityType];
    if (pfEntityDataFields) {
      const entityIndex = pfEntityDataFields.findIndex( x => x.FieldName === entity.FieldName);
      if (entityIndex >= 0) {
        pfEntityDataFields[entityIndex].HasAssociation = true;
        providerFields[entityType] = pfEntityDataFields;
      }
    }
    return providerFields;
  }

  static addAssociationToPayfactorsEntity(entityType: string, payfactorsEntityId: number,
    entity: EntityDataField,
    payfactorsFields: EntityField): EntityField {
    const pffEntityDataFields: EntityDataField[] = payfactorsFields[entityType];
    if (pffEntityDataFields) {
      const entityIndex = pffEntityDataFields.findIndex( x => {
        return x.EntityFieldId === payfactorsEntityId;
      });
      const entityToUpdate = pffEntityDataFields[entityIndex];
      entityToUpdate.AssociatedEntity.push(entity);
      pffEntityDataFields[entityIndex] = entityToUpdate;
      payfactorsFields[entityType] = pffEntityDataFields;
    }
    return payfactorsFields;
  }

  static removeAssociationToProviderEntity(entityType: string, entity: EntityDataField, providerFields: EntityField): EntityField {
    const pfEntityDataFields: EntityDataField[] = providerFields[entityType].map( x => {
      if (x.FieldName === entity.FieldName) {
        x.HasAssociation = false;
      }
      return x;
    });
    providerFields[entityType] = pfEntityDataFields;

    return providerFields;
  }

  static removeAssociationToPayfactorsEntity(entityType: string, payfactorsEntityIndex: number, payfactorsFields: EntityField): EntityField {
    const pffEntityDataFields = payfactorsFields[entityType].map( x => {
      if (x.EntityFieldId === payfactorsEntityIndex) {
        x.AssociatedEntity = [];
      }
      return x;
    });
    payfactorsFields[entityType] = pffEntityDataFields;

    return payfactorsFields;
  }

  static mapCustomUdfFieldsToPayfactorsEntity(customFields: any[], payfactorsFields: EntityDataField[]): EntityDataField[] {
    const udfFields = payfactorsFields.filter(x => x.FieldName.toLowerCase().startsWith('udf'));

    if (udfFields.length > 0) {
      customFields.forEach(customField => {
        const udfField = udfFields.find(udf => udf.FieldName + 'Name' === customField.Key);
        udfField.DisplayName = customField.Value;
      });
    }

    return payfactorsFields.filter(x => !x.DisplayName.toLowerCase().startsWith('udf'));
  }
}
