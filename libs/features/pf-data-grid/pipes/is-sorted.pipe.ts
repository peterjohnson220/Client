import { Pipe, PipeTransform } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { ColumnComponent } from '@progress/kendo-angular-grid';

@Pipe({
  name: 'isSorted',
  pure: true
})

export class IsSortedPipe implements PipeTransform {
  transform(column: ColumnComponent, sortDescriptor: SortDescriptor[]) {
    return !!column && !!sortDescriptor && !!sortDescriptor.length && sortDescriptor.some(s => s.field === column.field);
  }
}
