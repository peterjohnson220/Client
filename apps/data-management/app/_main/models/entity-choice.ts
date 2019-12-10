import {LoaderType} from 'libs/constants/data-load';

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
          columnNames: null
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
          columnNames: null
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
          columnNames: null
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
          columnNames: null
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
          columnNames: null
        }
    ];
}

export function getMockEntityChoiceList(): EntityChoice[] {
    const mock = getEntityChoicesForOrgLoader();
    mock[0].isChecked = true;
    mock[4].isChecked = true;
    return mock;
}
