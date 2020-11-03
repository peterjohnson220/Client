import {Component } from '@angular/core';

import { ListAreaBaseFilterDirective } from '../list-area-base-filter.directive';
import { DateOperatorOptions } from 'libs/features/job-description-management/models/list-area-options.model';

@Component({
  selector: 'pf-list-area-filter-date',
  templateUrl: './list-area-filter-date.component.html'
})
export class ListAreaFilterDateComponent extends ListAreaBaseFilterDirective {
  public dropDownOptions = DateOperatorOptions;
  public disableValueOperators = DateOperatorOptions.filter(t => !t.checkValue);
}
