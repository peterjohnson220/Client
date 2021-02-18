import { Component, Input } from '@angular/core';

import { RangeGroupMetadata } from 'libs/models/structures';

@Component({
  selector: 'pf-grid-context',
  templateUrl: 'grid-context.component.html',
  styleUrls: ['grid-context.component.scss']
})
export class GridContextComponent {
  @Input() title: string;
  @Input() metadata: RangeGroupMetadata;
  @Input() enableReturnBtn = false;
  @Input() currentRangeGroupName: string;
  @Input() compareFlag: boolean;
  @Input() buttonText: string;

  constructor() {}

  handleEndCompare() {
    window.location.reload();
  }
}
