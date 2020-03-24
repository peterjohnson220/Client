import { Component, Input } from '@angular/core';

import { RangeGroupMetadata } from "../../models";

@Component({
  selector: 'pf-grid-context',
  templateUrl: 'grid-context.component.html',
  styleUrls: ['grid-context.component.scss']
})
export class GridContextComponent {
  @Input() title: string;
  @Input() metadata: RangeGroupMetadata;
  @Input() enableReturnBtn: boolean;

  constructor() {}
}
