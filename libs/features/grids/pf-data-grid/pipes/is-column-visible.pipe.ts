import { Pipe, PipeTransform } from '@angular/core';
import { ViewField } from 'libs/models/payfactors-api';

@Pipe({
  name: 'isColumnVisible',
  pure: true
})

export class IsColumnVisiblePipe implements PipeTransform {
  transform(col: ViewField, splitViewDisplayFields: string[], selectedRecordId: number) {
    if (selectedRecordId) {
      return col.IsLocked || (splitViewDisplayFields.includes(`${col.EntitySourceName}_${col.SourceName}`) && col.IsSelectable && col.IsSelected);
    } else {
      return col.IsSelectable && col.IsSelected;
    }
  }
}
