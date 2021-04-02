import { Component, Input, OnInit } from '@angular/core';

import { RangeGroupMetadata } from 'libs/models/structures';

@Component({
  selector: 'pf-grid-context',
  templateUrl: 'grid-context.component.html',
  styleUrls: ['grid-context.component.scss']
})
export class GridContextComponent implements OnInit{
  @Input() title: string;
  @Input() metadata: RangeGroupMetadata;
  @Input() enableReturnBtn = false;
  @Input() currentRangeGroupName: string;
  @Input() compareFlag: boolean;
  @Input() buttonText: string;
  @Input() rangeId: string;
  @Input() rangeGroupId: string;
  @Input() fromJobsView: boolean;

  routerLink: string;

  constructor() {}

  handleEndCompare() {
    window.location.reload();
  }

  ngOnInit(): void {
    this.routerLink = this.fromJobsView ? `/grade/${this.rangeGroupId}/jobs/${this.rangeId}` : `/grade/${this.rangeGroupId}/employees/${this.rangeId}`;
  }
}
