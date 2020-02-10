import { FieldNames } from './';

export interface EntityIdentifierViewModel {
    Field: string;
    isChecked: boolean;
    isDisabled: boolean;
}

export function EntityIdentifierViewModelOptions(): EntityIdentifierViewModel[] {
    return [
        { Field: FieldNames.EMPLOYEE_ID, isChecked: true, isDisabled: true },
        { Field: FieldNames.DEPARTMENT, isChecked: false, isDisabled: false },
        { Field: FieldNames.MANAGER_EMPLOYEE_ID, isChecked: false, isDisabled: false }
    ];
}

export function MockEntityIdentifierViewModelOptions(): EntityIdentifierViewModel[] {
    return [
        ...EntityIdentifierViewModelOptions(),
        { Field: 'Field4', isChecked: false, isDisabled: false },
        { Field: 'Field5', isChecked: false, isDisabled: false }
    ];
}
