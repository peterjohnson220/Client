import { Component } from '@angular/core';

import { TextOperatorOptions } from 'libs/features/jobs/job-description-management/models/list-area-options.model';
import { ListAreaBaseFilterDirective } from '../list-area-base-filter.directive';

@Component({
  selector: 'pf-list-area-filter-text',
  templateUrl: './list-area-filter-text.component.html'
})
export class ListAreaFilterTextComponent extends ListAreaBaseFilterDirective {
  public dropDownOptions = TextOperatorOptions;
  public disableValueOperators = TextOperatorOptions.filter(t => !t.checkValue);
}
