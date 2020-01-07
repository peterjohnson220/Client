import { Component } from '@angular/core';
import { ListAreaBaseFilter } from '../list-area-base-filter';
import { BooleanOperatorOptions, PublicViewOptions } from '../../../models/list-area-options.model';


@Component({
    selector: 'pf-list-area-filter-boolean',
    templateUrl: './list-area-filter-boolean.component.html'
})
export class ListAreaFilterBooleanComponent extends ListAreaBaseFilter {
    public dropDownOptions = BooleanOperatorOptions;
    public publicViewOptions = PublicViewOptions;
    public disableValueOperators = PublicViewOptions.filter(t => !t.checkValue);
}
