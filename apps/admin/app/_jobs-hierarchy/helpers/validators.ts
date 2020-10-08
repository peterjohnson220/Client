import { ValidatorFn, FormArray } from '@angular/forms';

export function minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
        const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
        return totalSelected >= min ? null : { required: true };
    };
    return validator;
}

export function minControls(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
        return formArray.controls.length >= min ? null : { required: true };
    };
    return validator;
}

