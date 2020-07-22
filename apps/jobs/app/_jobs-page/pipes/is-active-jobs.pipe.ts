import { Pipe, PipeTransform } from '@angular/core';
import { ViewField } from 'libs/models/payfactors-api';

@Pipe({
  name: 'showingActiveJobs',
  pure: true
})

export class ShowingActiveJobs implements PipeTransform {
  transform(jobStatusField: ViewField) {
    return jobStatusField ? jobStatusField.FilterValue : true;
  }
}
