import {OrgDataEntityType} from 'libs/constants/hris-api';

export interface TransferScheduleSummary {
  entityMappingType_ID: number;
  entityMappingTypeCode: OrgDataEntityType;
  entityMappingTypeName: string;
  supported: boolean;
  expression: string;
  active?: number;
  syncSchedule_ID?: number;
  connection_ID?: number;
  company_ID?: number;
  lastSync_Date?: Date;
  nextSync_Date?: Date;
}


export function generateMockTransferScheduleSummaries(): TransferScheduleSummary[] {
  return [
    {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: '* * * * *'
    },
    {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: '* * * * *'
    },
    {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: false,
      expression: '* * * * *'
    }
  ];
}
