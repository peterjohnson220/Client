import { environment } from 'environments/environment';
import { LoaderType } from 'libs/features/org-data-loader/constants';
import { EntityCustomFieldsModel } from 'libs/features/org-data-loader/models/entity-custom-fields.model';

export interface EntityChoice {
  isChecked: boolean;
  DisplayText: string;
  ToolTip: string;
  FileBeginsWith: string;
  File: File;
  isSelectedTab: boolean;
  templateReferenceConstants: LoaderType;
  payfactorsDataFields: string[];
  loaderEnabled: boolean;
  columnNames: string[];
  customFields: EntityCustomFieldsModel;
  dbName?: string;
  isFullReplace: boolean;
  dateFormat: string;
  isLoadingFinish: boolean;
  isEnabled: boolean;
}

export function getDefaultEntityChoice(): EntityChoice {
  return {
    isChecked: false,
    DisplayText: null,
    ToolTip: null,
    FileBeginsWith: null,
    File: null,
    isSelectedTab: false,
    templateReferenceConstants: null,
    payfactorsDataFields: null,
    loaderEnabled: false,
    columnNames: null,
    customFields: { Employees: null, Jobs: null },
    isFullReplace: null,
    dateFormat: null,
    isLoadingFinish: true,
    dbName: null,
    isEnabled: true
  };
}

export function getEntityChoicesForOrgLoader(shouldShowBenefits: boolean): EntityChoice[] {
  return [
    {
      ...getDefaultEntityChoice(),
      DisplayText: 'Pay Markets',
      ToolTip: 'Fields within this entity specify the attributes of your pay markets.  Pay Markets represent each unique way the same job can be priced.',
      FileBeginsWith: 'paymarkets',
      templateReferenceConstants: LoaderType.PayMarkets,
      dbName: 'PayMarkets'
    },
    {
      ...getDefaultEntityChoice(),
      DisplayText: 'Jobs',
      ToolTip: 'Fields within this entity specify the attributes of your organizational jobs.',
      FileBeginsWith: 'jobs',
      templateReferenceConstants: LoaderType.Jobs,
      dbName: 'Jobs'
    },
    {
      ...getDefaultEntityChoice(),
      DisplayText: 'Structures',
      ToolTip: 'Fields within this entity specify the attributes of you salary structure data.',
      FileBeginsWith: 'structures',
      templateReferenceConstants: LoaderType.Structures,
      dbName: 'Structures'
    },
    {
      ...getDefaultEntityChoice(),
      DisplayText: 'Structure Mapping',
      ToolTip: 'Fields within this entity create linkage among jobs, Pay Markets, and Salary Structures.',
      FileBeginsWith: 'structuremapping',
      templateReferenceConstants: LoaderType.StructureMapping,
      dbName: 'StructureMapping'
    },
    {
      ...getDefaultEntityChoice(),
      DisplayText: 'Employees',
      ToolTip: `Fields within this entity specify the attributes of your employees.
           In addition, job and pay markets are captured and linked so that analysis can be executed within the Payfactors application.`,
      FileBeginsWith: 'employees',
      templateReferenceConstants: LoaderType.Employees,
      dbName: 'Employees'
    },
    {
      ...getDefaultEntityChoice(),
      DisplayText: 'Subsidiaries',
      ToolTip: `Fields within this entity capture the subsidiary information for employee data.`,
      FileBeginsWith: 'subsidiaries',
      templateReferenceConstants: LoaderType.Subsidiaries,
      dbName: 'Subsidiary',
      isEnabled: false
    },
    {
      ...getDefaultEntityChoice(),
      DisplayText: 'Benefits',
      ToolTip: `Fields within this entity capture the value of benefits paid to employees for the Total Rewards Statement`,
      FileBeginsWith: 'benefits',
      templateReferenceConstants: LoaderType.Benefits,
      dbName: 'Benefits',
      isEnabled: false
    }
  ];
}

export function getMockEntityChoiceList(): EntityChoice[] {
  const mock = getEntityChoicesForOrgLoader(true);
  mock[0].isChecked = true;
  mock[4].isChecked = true;
  return mock;
}
