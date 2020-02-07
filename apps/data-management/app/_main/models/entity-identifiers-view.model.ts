import { FieldNames } from './';

export interface EntityIdentifierViewModel {
    Field: string;
    isChecked: boolean;
    isDisabled: boolean;
}

export function EntityIdentifierViewModelOptions(): EntityIdentifierViewModel[] {
    return [
        { Field: FieldNames.EMPLOYEE_ID, isChecked: true, isDisabled: true },
        { Field: 'Job Code', isChecked: false, isDisabled: false },
        { Field: 'Manager Id', isChecked: false, isDisabled: false },
        { Field: 'Field2', isChecked: false, isDisabled: false },
        { Field: 'Field3', isChecked: false, isDisabled: false }
    ];
}
