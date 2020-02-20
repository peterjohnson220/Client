import { LoaderType } from 'libs/features/org-data-loader/constants';
import {EntityCustomFieldsModel} from 'libs/features/org-data-loader/models/entity-custom-fields.model';


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
}

export function getEntityChoicesForOrgLoader(): EntityChoice[] {
  return [
    {
      isChecked: false,
      DisplayText: 'Pay Markets',
      ToolTip: 'Fields within this entity specify the attributes of your pay markets.  Pay Markets represent each unique way the same job can be priced.',
      FileBeginsWith: 'paymarkets',
      File: null,
      isSelectedTab: false,
      templateReferenceConstants: LoaderType.PayMarkets,
      payfactorsDataFields: null,
      loaderEnabled: false,
      columnNames: null,
      customFields: {Employees: null, Jobs: null},
      isFullReplace: null,
      dateFormat: null,
      isLoadingFinish: true,
      dbName: 'paymarkets'
    },
    {
      isChecked: false,
      DisplayText: 'Jobs',
      ToolTip: 'Fields within this entity specify the attributes of your organizational jobs.',
      FileBeginsWith: 'jobs',
      File: null,
      isSelectedTab: false,
      templateReferenceConstants: LoaderType.Jobs,
      payfactorsDataFields: null,
      loaderEnabled: false,
      columnNames: null,
      customFields: {Employees: null, Jobs: null},
      isFullReplace: null,
      dateFormat: null,
      isLoadingFinish: true,
      dbName: 'jobs'
    },
    {
      isChecked: false,
      DisplayText: 'Structures',
      ToolTip: 'Fields within this entity specify the attributes of you salary structure data.',
      FileBeginsWith: 'structures',
      File: null,
      isSelectedTab: false,
      templateReferenceConstants: LoaderType.Structures,
      payfactorsDataFields: null,
      loaderEnabled: false,
      columnNames: null,
      customFields: {Employees: null, Jobs: null},
      isFullReplace: null,
      dateFormat: null,
      isLoadingFinish: true,
      dbName: 'structures'
    },
    {
      isChecked: false,
      DisplayText: 'Structure Mapping',
      ToolTip: 'Fields within this entity create linkage among jobs, Pay Markets, and Salary Structures.',
      FileBeginsWith: 'structuremapping',
      File: null,
      isSelectedTab: false,
      templateReferenceConstants: LoaderType.StructureMapping,
      payfactorsDataFields: null,
      loaderEnabled: false,
      columnNames: null,
      customFields: {Employees: null, Jobs: null},
      isFullReplace: null,
      dateFormat: null,
      isLoadingFinish: true,
      dbName: 'structuremappings'
    },
    {
      isChecked: false,
      DisplayText: 'Employees',
      ToolTip: `Fields within this entity specify the attributes of your employees.
           In addition, job and pay markets are captured and linked so that analysis can be executed within the Payfactors application.`,
      FileBeginsWith: 'employees',
      File: null,
      isSelectedTab: false,
      templateReferenceConstants: LoaderType.Employees,
      payfactorsDataFields: null,
      loaderEnabled: false,
      columnNames: null,
      customFields: {Employees: null, Jobs: null},
      isFullReplace: null,
      dateFormat: null,
      isLoadingFinish: true,
      dbName: 'employees'
    }
  ];
}

export function getMockEntityChoiceList(): EntityChoice[] {
  const mock = getEntityChoicesForOrgLoader();
  mock[0].isChecked = true;
  mock[4].isChecked = true;
  return mock;
}
