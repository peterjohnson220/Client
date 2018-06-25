import { Component, Input, OnInit } from '@angular/core';

import { JobResult } from '../../../models';

@Component({
  selector: 'pf-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit {

  @Input() job: JobResult;

  toggleDataCutsLabel: string;
  showDataCuts: boolean;

  private readonly showCutsLabel: string = 'Show Cuts';
  private readonly hideCutsLabel: string = 'Hide Cuts';

  constructor() {}

  ngOnInit(): void {
    this.toggleDataCutsLabel = this.showCutsLabel;
    this.showDataCuts = this.job.IsPayfactors;
  }

  toggleDataCutsDisplay(): void {
    this.showDataCuts = !this.showDataCuts;
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;
  }
}
