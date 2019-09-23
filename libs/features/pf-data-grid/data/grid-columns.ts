export const jobsConfig = {
    'Identifier': 'CompanyJob_ID',
    'Columns': [
        {
            'Name': 'Job_Title',
            'Description': 'Job Title',
            'Type': 'text',
            'CompactView': true
        }, {
            'Name': 'Job_Code',
            'Description': 'Job Code',
            'Type': 'text',
            'CompactView': true
        }, {
            'Name': 'Job_Family',
            'Description': 'Job Family',
            'Type': 'text',
            'CompactView': true
        }, {
            'Name': 'Complex_Col',
            'Description': 'Complex Col',
            'Type': 'template',
            'CompactView': false,
            'Columns': ['Match_Count', 'FLSA_Status']
        }, {
            'Name': 'Complex_Col2',
            'Description': 'Complex Col 2',
            'Type': 'template',
            'CompactView': false,
            'Columns': ['Match_Count', 'Job_Level']
        },
    ]
}


export const employeesConfig = {
    'Identifier': 'CompanyEmployeeId',
    'Columns': [
        {
            'Name': 'CompanyEmployeeId',
            'Description': 'Employee ID',
            'Type': 'text',
            'CompactView': 'true'
        }, {
            'Name': 'JobCode',
            'Description': 'Job Code',
            'Type': 'text',
            'CompactView': 'false'
        }, {
            'Name': 'JobTitle',
            'Description': 'Job Title',
            'Type': 'text',
            'CompactView': 'false'
        }, {
            'Name': 'FirstName',
            'Description': 'First Name',
            'Type': 'text',
            'CompactView': 'true'
        }, {
            'Name': 'LastName',
            'Description': 'Last Name',
            'Type': 'text',
            'CompactView': 'true'
        }, {
            'Name': 'PayMarket',
            'Description': 'Pay Market',
            'Type': 'text',
            'CompactView': 'false'
        }, {
            'Name': 'BaseSalaryRate',
            'Description': 'Rate',
            'Type': 'text',
            'CompactView': 'false'
        }, {
            'Name': 'Currency',
            'Description': 'Currency',
            'Type': 'text',
            'CompactView': 'false'
        }
    ]
}
