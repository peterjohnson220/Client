import { PipeTransform, Pipe } from '@angular/core';
import { FilterableName } from '../interfaces/FilterableName';

/*
 * Filter an array of FilterableName's by the filter string
 * *
 * Usage:
 *   value | filterArrayByName:filter
*/
@Pipe({ name: 'filterArrayByName' })
export class FilterArrayByName implements PipeTransform {
  transform(items: FilterableName[], filter: string): any[] {
    if (!items) { return []; }
    if (!filter) { return items; }

    return items.filter(i => i.Name.toLowerCase().includes(filter.toLowerCase()));
  }
}
