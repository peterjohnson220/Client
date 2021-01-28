import { Pipe, PipeTransform } from '@angular/core';
import { ViewField } from 'libs/models/payfactors-api';

@Pipe({
  name: 'mappedFieldName',
  pure: true
})

export class MappedFieldNamePipe implements PipeTransform {
  transform(col: ViewField) {
    return (col.EntitySourceName ? col.EntitySourceName + '_' : '') + col.SourceName;
  }
}
