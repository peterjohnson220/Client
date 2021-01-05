import { Component } from '@angular/core';

import { NumericOperatorOptions } from 'libs/features/jobs/job-description-management/models/list-area-options.model';
import { ListAreaBaseFilterDirective } from '../list-area-base-filter.directive';

@Component({
  selector: 'pf-list-area-filter-number',
  templateUrl: './list-area-filter-number.component.html'
})
export class ListAreaFilterNumberComponent extends ListAreaBaseFilterDirective {
  public dropDownOptions = NumericOperatorOptions;
  public disableValueOperators = NumericOperatorOptions.filter(t => !t.checkValue);
}
