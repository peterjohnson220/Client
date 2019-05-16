import { Pipe, PipeTransform } from '@angular/core';

import { ListAreaColumn } from 'libs/models/common';

@Pipe({ name: 'listAreaColumnSearch', pure: true })
export class ListAreaColumnSearchPipe implements PipeTransform {
  transform(listofColumns: ListAreaColumn[], searchTerm: string) {
    if (searchTerm != null) {
      searchTerm = searchTerm.toLowerCase();
      const test: any = listofColumns.filter(c => c.ColumnDisplayName.toLowerCase().indexOf(searchTerm) > -1);
      return test;
    } else {
      return listofColumns;
    }
  }
}
