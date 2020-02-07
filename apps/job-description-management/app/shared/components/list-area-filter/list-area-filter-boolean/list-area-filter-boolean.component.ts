import { Component } from '@angular/core';
import { ListAreaBaseFilter } from '../list-area-base-filter';
import { BooleanOperatorOptions } from '../../../models/list-area-options.model';
import { JobDescriptionViewConstants } from '../../../constants';


@Component({
    selector: 'pf-list-area-filter-boolean',
    templateUrl: './list-area-filter-boolean.component.html'
})
export class ListAreaFilterBooleanComponent extends ListAreaBaseFilter {

    public publicViewOptions = JobDescriptionViewConstants.PUBLIC_VIEW_OPTIONS;

    public dropDownOptions = BooleanOperatorOptions;
    public disableValueOperators = BooleanOperatorOptions.filter(t => !t.checkValue);
}
