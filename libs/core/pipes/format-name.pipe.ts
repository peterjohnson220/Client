import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatName'
})
export class FormatNamePipe implements PipeTransform {

  transform(firstName: string, lastName: string, id: string, isFullName = false): string {
    if (this.isEmpty(firstName) && this.isEmpty(lastName)) {
      return id;
    }

    return isFullName ? (firstName + ' ' + lastName).trim() : firstName || lastName;
  }

  isEmpty(value: string): boolean {
    return value === null || value === '';
  }

}
