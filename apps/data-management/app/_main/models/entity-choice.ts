export interface EntityChoice {
    isChecked: boolean;
    DisplayText: string;
    ToolTip: string;
}

export function getEntityChoicesForOrgLoader(): EntityChoice[] {
    return [
        {
            isChecked: false,
            DisplayText: 'Pay Markets',
            ToolTip: 'Fields within this entity specify the attributes of your pay markets.  Pay Markets represent each unique way the same job can be priced.'
        },
        {
            isChecked: false,
            DisplayText: 'Jobs',
            ToolTip: 'Fields within this entity specify the attributes of your organizational jobs.'
        },
        {
            isChecked: false,
            DisplayText: 'Structures',
            ToolTip: 'Fields within this entity specify the attributes of you salary structure data.'
        },
        {
            isChecked: false,
            DisplayText: 'Structure Mapping',
            ToolTip: 'Fields within this entity create linkage among jobs, Pay Markets, and Salary Structures.'
        },
        {
            isChecked: false,
            DisplayText: 'Employees',
            ToolTip: `Fields within this entity specify the attributes of your employees.
             In addition, job and pay markets are captured and linked so that analysis can be executed within the Payfactors application.`
        }
    ];
}

export function getMockEntityChoiceList(): EntityChoice[] {
    const mock = getEntityChoicesForOrgLoader();
    mock[0].isChecked = true;
    mock[4].isChecked = true;
    return mock;
}
