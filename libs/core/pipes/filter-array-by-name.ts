import { PipeTransform, Pipe } from '@angular/core';

/*
 * Filter an array by the filter string
 * *
 * Usage:
 *   value | filterArrayByName : filter : property
*/
@Pipe({ name: 'filterArrayByName' })
export class FilterArrayByName implements PipeTransform {
  transform(items: any[], filter: string, property: string = null): any[] {
    if (!items) { return []; }
    if (!filter) { return items; }

    return property ? items.filter(i => i[property] && i[property].toString().toLowerCase().includes(filter.toLowerCase())) :
    items.filter(i => i.Name && i.Name.toLowerCase().includes(filter.toLowerCase()));
  }
}
