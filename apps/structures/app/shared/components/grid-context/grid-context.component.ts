import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { RangeGroupMetadata } from 'libs/models/structures';

import * as fromJobBasedRangeReducer from '../../../_job-based-range/shared/reducers';
import * as fromJobBasedRangeActions from '../../../_job-based-range/shared/actions/shared.actions';

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
  @Input() adjustMetadata = false;

  constructor() {}

  handleEndCompare() {
    window.location.reload();
  }

}
