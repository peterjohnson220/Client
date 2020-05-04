import {Pipe, PipeTransform} from '@angular/core';
import {SortDescriptor} from '@progress/kendo-data-query';

@Pipe({
  name: 'isSortable',
  pure: true
})

export class IsSortablePipe implements PipeTransform {
  transform(isSortable: boolean, selectedRecordId: any, defaultSortDescriptor: SortDescriptor[]) {
    if (!isSortable) {
      return null;
    }

    if (selectedRecordId) {
      return null;
    }

    return {
      allowUnsort: defaultSortDescriptor[0].dir === 'asc',
      mode: 'single'
    };
  }
}
