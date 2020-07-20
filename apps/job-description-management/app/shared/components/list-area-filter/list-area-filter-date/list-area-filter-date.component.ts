import {Component } from '@angular/core';

import { ListAreaBaseFilter } from '../list-area-base-filter';
import { DateOperatorOptions } from 'libs/features/job-description-management/models/list-area-options.model';

@Component({
  selector: 'pf-list-area-filter-date',
  templateUrl: './list-area-filter-date.component.html'
})
export class ListAreaFilterDateComponent extends ListAreaBaseFilter {
  public dropDownOptions = DateOperatorOptions;
  public disableValueOperators = DateOperatorOptions.filter(t => !t.checkValue);
}
