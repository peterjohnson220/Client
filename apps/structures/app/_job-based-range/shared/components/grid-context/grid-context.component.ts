import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { RangeGroupMetadata } from '../../models';
import * as fromJobBasedRangeReducer from '../../reducers';
import * as fromJobBasedRangeActions from '../../actions/shared.actions';

@Component({
  selector: 'pf-grid-context',
  templateUrl: 'grid-context.component.html',
  styleUrls: ['grid-context.component.scss']
})
export class GridContextComponent {
  @Input() title: string;
  @Input() metadata: RangeGroupMetadata;
  @Input() enableReturnBtn: boolean;
  @Input() currentRangeGroupName: string;
  @Input() compareFlag: boolean;

  constructor() {}

  handleEndCompare() {
    window.location.reload();
  }

}
