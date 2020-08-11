import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jobTitleCode',
  pure: true
})

export class JobTitleCodePipe implements PipeTransform {
  transform(jobObj: any, entity: string, jobTitleField: string, jobCodeField: string) {
    const jobTitleKey = `${entity}_${jobTitleField}`;
    const jobCodeKey = `${entity}_${jobCodeField}`;

    return `${jobObj[jobTitleKey]} (${jobObj[jobCodeKey]})`;
  }
}
