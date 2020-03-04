import { FieldNames } from './';

export interface EntityIdentifierViewModel {
    Field: string;
    DbColumn: string;
    isChecked: boolean;
    isDisabled: boolean;
}

export function EntityIdentifierViewModelOptions(): EntityIdentifierViewModel[] {
    return [
        { Field: FieldNames.EMPLOYEE_ID, DbColumn: FieldNames.EMPLOYEE_ID, isChecked: true, isDisabled: true },
        { Field: FieldNames.DEPARTMENT, DbColumn: FieldNames.DEPARTMENT, isChecked: false, isDisabled: false },
        { Field: FieldNames.MANAGER_EMPLOYEE_ID, DbColumn: FieldNames.MANAGER_EMPLOYEE_ID, isChecked: false, isDisabled: false },
        { Field: FieldNames.JOB_CODE, DbColumn: FieldNames.JOB_CODE, isChecked: false, isDisabled: false }
    ];
}

export function MockEntityIdentifierViewModelOptions(): EntityIdentifierViewModel[] {
    return [
        ...EntityIdentifierViewModelOptions(),
        { Field: 'ExtraField1', DbColumn: 'ExtraField1', isChecked: false, isDisabled: false },
        { Field: 'ExtraField2', DbColumn: 'ExtraField2', isChecked: false, isDisabled: false }
    ];
}
