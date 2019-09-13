import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'columnChooserSearch', pure: true })
export class ColumnSearchPipe implements PipeTransform {
  transform(columns: any[], searchTerm: string) {
    return searchTerm != null ?
      columns.filter(c => c.DisplayName.toLowerCase().indexOf(searchTerm) > -1) :
      columns;
  }
}
