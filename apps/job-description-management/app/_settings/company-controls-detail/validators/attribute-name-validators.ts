import { FormGroup } from '@angular/forms';

export function AttributeNamesAreUnique() {
    return (group: FormGroup): {[key: string]: any} => {

        const attributes = group.value;
        if (attributes.length > 0) {
            const sortedAttributes = attributes.map(a => a.DisplayName).sort();
            // sorting simplifies the duplicate checking because each member only has to be compared with its neighbor
            for (let i = 1; i < sortedAttributes.length; i++) {
                if (sortedAttributes[i - 1] === sortedAttributes[i]) {
                    return { duplicateAttributeNames: true };
                }
            }
        }
        return null;
    };
}
