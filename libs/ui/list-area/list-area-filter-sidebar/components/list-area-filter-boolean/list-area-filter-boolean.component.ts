import { Component } from '@angular/core';
import { ListAreaBaseFilterDirective } from '../list-area-base-filter.directive';
import { BooleanOperatorOptions } from 'libs/features/jobs/job-description-management/models/list-area-options.model';
import { JobDescriptionViewConstants } from 'libs/features/jobs/job-description-management/constants';

@Component({
    selector: 'pf-list-area-filter-boolean',
    templateUrl: './list-area-filter-boolean.component.html'
})
export class ListAreaFilterBooleanComponent extends ListAreaBaseFilterDirective {

    public publicViewOptions = JobDescriptionViewConstants.PUBLIC_VIEW_OPTIONS;

    public dropDownOptions = BooleanOperatorOptions;
    public disableValueOperators = BooleanOperatorOptions.filter(t => !t.checkValue);
}
