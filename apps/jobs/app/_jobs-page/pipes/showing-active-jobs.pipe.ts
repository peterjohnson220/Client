import { Pipe, PipeTransform } from '@angular/core';
import { ViewField } from 'libs/models/payfactors-api';

@Pipe({
  name: 'showingActiveJobs',
  pure: true
})

export class ShowingActiveJobs implements PipeTransform {
  transform(jobStatusField: ViewField) {
    // TODO: The JobStatus field filter can have a value of 'true' or true.
    // This is because of the way the active/inactive slider sets the filter value
    // This  quick fix needs to be converted to a more robust solution
    return jobStatusField ? (jobStatusField.FilterValue === 'true' || <any>jobStatusField.FilterValue === true) : true;
  }
}
