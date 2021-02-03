import { Pipe, PipeTransform } from '@angular/core';
import fromUnixTime from 'date-fns/fromUnixTime';

//need to create our own fromUnixTime pipe, because ngx-date-fns does not currently support it.
@Pipe({name: 'pfParseDateFromUnixTime', pure: true})
export class PfParseDateFromUnixTimePipe implements PipeTransform {
  transform(timestamp: number): Date {
    return fromUnixTime(timestamp);
  }
}