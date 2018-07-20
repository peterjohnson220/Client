import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { JobResult, JobDetailsToolTipData } from '../../models';

@Component({
  // The job result table row needs to be an immediate child of the tbody.
  // this component will be used through an attribute selector.
  // tslint:disable-next-line
  selector: '[pf-job-result]',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit {

  @Input() job: JobResult;
  @Output() jobTitleClick: EventEmitter<JobDetailsToolTipData> = new EventEmitter<JobDetailsToolTipData>();

  toggleDataCutsLabel: string;
  showDataCuts: boolean;

  private readonly showCutsLabel: string = 'Show Cuts';
  private readonly hideCutsLabel: string = 'Hide Cuts';

  ngOnInit(): void {
    this.toggleDataCutsLabel = this.showCutsLabel;
    this.showDataCuts = this.job.IsPayfactors;
  }

  toggleDataCutsDisplay(): void {
    this.showDataCuts = !this.showDataCuts;
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;
  }

  handleJobTitleClick(event: MouseEvent): void {
    const data: JobDetailsToolTipData = {
      TargetX: event.offsetX + 10,
      TargetY: event.clientY,
      Job: this.job
    };
    this.jobTitleClick.emit(data);
  }
}
