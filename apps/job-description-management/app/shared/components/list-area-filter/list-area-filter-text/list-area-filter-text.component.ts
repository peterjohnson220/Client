import { Component } from '@angular/core';

import { TextOperatorOptions } from 'libs/features/job-description-management/models/list-area-options.model';
import { ListAreaBaseFilter } from '../list-area-base-filter';

@Component({
  selector: 'pf-list-area-filter-text',
  templateUrl: './list-area-filter-text.component.html'
})
export class ListAreaFilterTextComponent extends ListAreaBaseFilter {
  public dropDownOptions = TextOperatorOptions;
  public disableValueOperators = TextOperatorOptions.filter(t => !t.checkValue);
}
