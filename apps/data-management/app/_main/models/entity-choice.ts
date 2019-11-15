export interface EntityChoice {
    isChecked: boolean;
    DisplayText: string;
    ToolTip: string;
    FileBeginsWith: string;
    File: File;
}

export function getEntityChoicesForOrgLoader(): EntityChoice[] {
    return [
        {
            isChecked: false,
            DisplayText: 'Pay Markets',
            ToolTip: 'Fields within this entity specify the attributes of your pay markets.  Pay Markets represent each unique way the same job can be priced.',
            FileBeginsWith: 'paymarkets',
            File: null
        },
        {
            isChecked: false,
            DisplayText: 'Jobs',
            ToolTip: 'Fields within this entity specify the attributes of your organizational jobs.',
            FileBeginsWith: 'jobs',
            File: null
        },
        {
            isChecked: false,
            DisplayText: 'Structures',
            ToolTip: 'Fields within this entity specify the attributes of you salary structure data.',
            FileBeginsWith: 'structures',
            File: null
        },
        {
            isChecked: false,
            DisplayText: 'Structure Mapping',
            ToolTip: 'Fields within this entity create linkage among jobs, Pay Markets, and Salary Structures.',
            FileBeginsWith: 'structuremapping',
            File: null
        },
        {
            isChecked: false,
            DisplayText: 'Employees',
            ToolTip: `Fields within this entity specify the attributes of your employees.
             In addition, job and pay markets are captured and linked so that analysis can be executed within the Payfactors application.`,
            FileBeginsWith: 'employees',
            File: null
        }
    ];
}

export function getMockEntityChoiceList(): EntityChoice[] {
    const mock = getEntityChoicesForOrgLoader();
    mock[0].isChecked = true;
    mock[4].isChecked = true;
    return mock;
}
