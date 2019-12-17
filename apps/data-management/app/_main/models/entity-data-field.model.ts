import { OrgDataEntityType } from 'libs/constants';

export interface EntityDataField {
  EntityType: OrgDataEntityType;
  FieldName: string;
  IsRequired?: boolean;
  AssociatedEntity?: EntityDataField[];
  HasDescription?: boolean;
  Description?: string;
}

export function generateMockProviderEntityFields(entityType: OrgDataEntityType): EntityDataField[] {
  return [
    {
      EntityType: entityType,
      FieldName: 'first_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'last_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'employee_gender',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'employee_status',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'pay_rate',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'country_code',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    }
  ];
}

export function generateMockPayfactorsEntityFields(entityType: OrgDataEntityType): EntityDataField[] {
  return [
    {
      EntityType: entityType,
      FieldName: 'first_name',
      IsRequired: true
    },
    {
      EntityType: entityType,
      FieldName: 'last_name',
      IsRequired: true
    },
    {
      EntityType: entityType,
      FieldName: 'gender',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'status',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'rate',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'country_code',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false
    }
  ];
}
