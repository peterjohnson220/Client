import {Pipe, PipeTransform} from '@angular/core';

import {TransferScheduleSummary} from 'libs/models/hris-api/sync-schedule';

@Pipe({
  name: 'getSupportedSchedulesPipe'
})
export class GetSupportedSchedulesPipe implements PipeTransform {
  transform(value: TransferScheduleSummary[]): any {
    return value ? value.filter(v => v.supported) : value;
  }
}
