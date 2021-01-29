import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'pfParseDate', pure: true})
export class PfParseDatePipe implements PipeTransform {
  transform(value: string | Date ): Date {
    return new Date(value == null ? "" : value);
  }
}
