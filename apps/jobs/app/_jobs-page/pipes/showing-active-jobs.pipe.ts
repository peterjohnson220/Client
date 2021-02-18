import { Pipe, PipeTransform } from '@angular/core';
import { ViewField } from 'libs/models/payfactors-api';

@Pipe({
  name: 'showingActiveJobs',
  pure: true
})

export class ShowingActiveJobs implements PipeTransform {
  transform(jobStatusField: ViewField) {
    const isActiveJob = jobStatusField?.FilterValues?.length > 0
      ? jobStatusField.FilterValues[0] === 'true'
      : true;
    return isActiveJob;
  }
}
