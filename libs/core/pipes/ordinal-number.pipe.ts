import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinalNumber'
})

export class OrdinalNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) {
      return;
    }

    switch (value.toString().slice(value.toString().length - 1)) {
      case '1':
        return value + 'st';
        break;
      case '2':
        return value +  'nd';
        break;
      case '3':
        return value +  'rd';
        break;
      default:
        return value +  'th';
        break;
    }
  }
}
