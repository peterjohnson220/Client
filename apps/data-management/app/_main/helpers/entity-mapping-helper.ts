import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';

import { OrgDataEntityType, ImportDataType } from 'libs/constants';
import { MappingPackage } from 'libs/models/hris-api';

import { EntityField, EntityDataField, DateFormat, ConverterOptions } from '../models';

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
    const nonUdfFields = payfactorsFields.filter(x => !x.FieldName.toLowerCase().startsWith('udf'));
    let definedUdfFields: EntityDataField[] = [];
    if (!isEmpty(udfFields) && !isEmpty(customFields)) {
      definedUdfFields = customFields
        .map(customField => {
          const udfField = udfFields.find(udf => (udf.FieldName.split('_').join('') + 'Name').toLowerCase() === customField.Key.toLowerCase());
          if (isObject(udfField)) {
            udfField.DisplayName = customField.Value;
          }
          return udfField;
        })
        .filter(isObject);
    }
    return [...nonUdfFields, ...definedUdfFields];
  }

  static mapMappedFieldsTpProviderAndPayfactorsFields(providerFields: EntityField,
    payfactorsFields: EntityField,
    mappingPackage: MappingPackage,
    selectedEntities: string[]): any {
      if (mappingPackage.mappingPayload.items.length === 0) {
        return { updatedProviderFields: providerFields, updatedPayfactorsFields: payfactorsFields };
      }

      selectedEntities.forEach(entity => {
        const entityType = OrgDataEntityType[entity];
        const mappedEntityItem = mappingPackage.mappingPayload.items.find(x => x.orgDataEntityType === entityType );
        const payfactorsDataFields: EntityDataField[] = payfactorsFields[entityType];
        const providerDataFields: EntityDataField[] = providerFields[entityType];

        if (mappedEntityItem && mappedEntityItem.mappings.length > 0) {
          mappedEntityItem.mappings.forEach(field => {
            const pfEntityIndex = payfactorsDataFields.findIndex( x => {
              return x.FieldName.toLowerCase() === field.destinationField.toLowerCase();
            });
            const pEntityIndex = providerDataFields.findIndex( x => {
              return x.FieldName.toLowerCase() === field.sourceField.toLowerCase();
            });
            providerDataFields[pEntityIndex].Metadata = {
              ...field.sourceMetadata.metadata
            };
            payfactorsDataFields[pfEntityIndex].AssociatedEntity.push(providerDataFields[pEntityIndex]);
            providerDataFields[pEntityIndex].HasAssociation = true;
          });
        }
        payfactorsFields[entityType] = payfactorsDataFields;
        providerFields[entityType] = providerDataFields;
      });
      return { updatedProviderFields: providerFields, updatedPayfactorsFields: payfactorsFields };
  }

  static removeUnselectedEntities(selectedEntities: string[], payfactorsFields: EntityField): EntityField {
    const filteredPfFields: EntityField = {
      Employees: [],
      Jobs: [],
      JobDescriptions: [],
      PayMarkets: [],
      StructureMapping: [],
      Structures: []
    };
    selectedEntities.forEach(e => {
      filteredPfFields[e] = payfactorsFields[e];
    });
    return filteredPfFields;
  }

  static addConverterOptions(dataType: number, entity: EntityDataField, converterOptions: ConverterOptions): EntityDataField {
    switch (dataType) {
      case ImportDataType.Date: {
        const updatedEntity = cloneDeep(entity);
        updatedEntity.Metadata = {
          ...updatedEntity.Metadata,
          'ConverterOptions': converterOptions
        };

        return updatedEntity;
      }
      default:
        return entity;
    }
  }
}
