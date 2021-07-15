import { Pipe, PipeTransform } from '@angular/core';
import { CompositeField } from '../../../../models';

@Pipe({
  name: 'selectAllStatus'
})
export class SelectAllStatusPipe implements PipeTransform {
  transform(fields: CompositeField[], statusToCheck: string = 'All') {
    switch (statusToCheck) {
      case 'All':
        return fields.every(x => x.Checked);
      case 'Indeterminate':
        const selectedFields = fields.filter(x => x.Checked);
        return selectedFields.length > 0 && selectedFields.length < fields.length;
      default:
        return false;
    }
  }
}
