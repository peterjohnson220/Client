import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'getErrorMessage'
})
export class GetErrorMessagePipe implements PipeTransform {
  transform(value: string[]): any {
    return value ? value.filter(Boolean).join(' ') : value;
  }
}
