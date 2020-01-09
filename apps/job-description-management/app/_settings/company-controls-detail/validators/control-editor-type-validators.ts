import { FormControl, FormGroup, FormArray, ValidatorFn } from '@angular/forms';

export function EditorTypeSmartListMissingRenderedType(editorType: string): ValidatorFn {
    return (group: FormGroup): {[key: string]: boolean} | null => {

        if (editorType !== 'SmartList' ) {
            return null;
        }

        const controlArray = <FormArray>group.controls['Attributes'];

        for (let i = 0; i < controlArray.length; i++) {
            const item = <FormGroup>controlArray.at(i);
            const canBeSourced = (<FormControl>item.controls['CanBeSourced']).value;

            if (canBeSourced) {
                return null;
            }
        }

        return { missingRenderedType: true };
    };
}
