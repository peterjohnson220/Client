import { OrgDataEntityType, ImportDataType } from 'libs/constants';

export interface EntityDataField {
  EntityFieldId?: number;
  EntityType: OrgDataEntityType;
  FieldName: string;
  DisplayName: string;
  DataType: ImportDataType;
  IsRequired?: boolean;
  AssociatedEntity?: EntityDataField[];
  HasDescription?: boolean;
  Description?: string;
  HasAssociation?: boolean;
  MetaData?: any;
}

export function generateMockProviderEntityFields(entityType: OrgDataEntityType): EntityDataField[] {
  return [
    {
      EntityType: entityType,
      FieldName: 'first_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'last_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'employee_gender',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'employee_status',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'pay_rate',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'country_code',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    }
  ];
}

export function generateMockPayfactorsEntityFields(entityType: OrgDataEntityType): EntityDataField[] {
  return [
    {
      EntityType: entityType,
      FieldName: 'first_name',
      IsRequired: true,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'last_name',
      IsRequired: true,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'gender',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'status',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'rate',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'country_code',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    },
    {
      EntityType: entityType,
      FieldName: 'field_name',
      IsRequired: false,
      DataType: ImportDataType.Custom,
      DisplayName: 'MockDisplayName'
    }
  ];
}
