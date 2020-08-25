import { Component } from '@angular/core';

import { NumericOperatorOptions } from 'libs/features/job-description-management/models/list-area-options.model';
import { ListAreaBaseFilter } from '../list-area-base-filter';

@Component({
  selector: 'pf-list-area-filter-number',
  templateUrl: './list-area-filter-number.component.html'
})
export class ListAreaFilterNumberComponent extends ListAreaBaseFilter {
  public dropDownOptions = NumericOperatorOptions;
  public disableValueOperators = NumericOperatorOptions.filter(t => !t.checkValue);
}
