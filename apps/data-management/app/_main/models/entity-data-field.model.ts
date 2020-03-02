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

export function getMockOutboundJdmDestinationFields(): EntityDataField[] {
  return [
    {
      AssociatedEntity: [],
      DataType: ImportDataType.Custom,
      DisplayName: 'Company_Insider_Data',
      EntityFieldId: 1,
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'Company_Insider_Data',
      HasDescription: false,
      IsRequired: false,
    },
    {
      AssociatedEntity: [],
      DataType: ImportDataType.Custom,
      DisplayName: 'Job_Description',
      EntityFieldId: 2,
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'Job_Description',
      HasDescription: false,
      IsRequired: false,
    },
    {
      AssociatedEntity: [],
      DataType: ImportDataType.Custom,
      DisplayName: 'Job_Family_Data',
      EntityFieldId: 3,
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'Job_Family_Data',
      HasDescription: false,
      IsRequired: false,
    },
    {
      AssociatedEntity: [],
      DataType: ImportDataType.Custom,
      DisplayName: 'Job_Profile_Private_Title',
      EntityFieldId: 4,
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'Job_Profile_Private_Title',
      HasDescription: false,
      IsRequired: false,
    },
    {
      AssociatedEntity: [],
      DataType: ImportDataType.Custom,
      DisplayName: 'Job_Profile_Summary',
      EntityFieldId: 5,
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'Job_Profile_Summary',
      HasDescription: false,
      IsRequired: true,
    },
    {
      AssociatedEntity: [],
      DataType: ImportDataType.Custom,
      DisplayName: 'Job_Title',
      EntityFieldId: 6,
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'Job_Title',
      HasDescription: false,
      IsRequired: true,
    },
    {
      AssociatedEntity: [],
      DataType: ImportDataType.Custom,
      DisplayName: 'Work_Shift_Required',
      EntityFieldId: 7,
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'Work_Shift_Required',
      HasDescription: false,
      IsRequired: false,
    },
  ];
}

export function getMockOutboundJdmSourceFields(): EntityDataField[] {
  return [
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'About Us',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'about_us',
      IsRequired: false,
    },
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'Experience',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'experience',
      IsRequired: false,
    },
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'Job Code',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'job_code',
      IsRequired: false,
    },
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'Job Family',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'job_family',
      IsRequired: false,
    },
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'Job Title',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'job_title',
      IsRequired: false,
    },
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'Licences/Certifications',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'licenses',
      IsRequired: false,
    },
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'Overview',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'overview',
      IsRequired: false,
    },
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'Required Qualifications',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'required_qualifications',
      IsRequired: false,
    },
    {
      DataType: ImportDataType.Custom,
      DisplayName: 'Summary',
      EntityType: OrgDataEntityType.JobDescriptions,
      FieldName: 'summary',
      IsRequired: false,
    },
  ];
}
