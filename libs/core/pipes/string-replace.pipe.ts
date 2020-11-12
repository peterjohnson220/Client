import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringReplace'
})
export class StringReplacePipe implements PipeTransform {
  transform(value: string, find: string | RegExp, replace: string): string {
    return value.replace(find, replace);
  }
}
