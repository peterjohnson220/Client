import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyPlaceholder'
})
export class EmptyPlaceholderPipe implements PipeTransform {

  constructor() { }

  transform(value: any, placeholder: string = '- -' ): any {
    return value === '' || value === null || value === undefined ? placeholder : value;
  }

}
