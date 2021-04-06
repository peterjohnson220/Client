import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import { Grade, GradeJob } from '../../models';


@Component({
  selector: 'pf-job-to-grade',
  templateUrl: './job-to-grade.component.html',
  styleUrls: ['./job-to-grade.component.scss']
})
export class JobToGradeComponent implements OnInit {
  @Input() grade: Grade;
  @Input() dragging: boolean;
  @Input() rate: string;
  @Input() rangeDistributionType: RangeDistributionTypeIds;
  @Output() loadJobs: EventEmitter<Grade> = new EventEmitter<Grade>();
  @Output() jobDeleted: EventEmitter<{ job: GradeJob, grade: Grade }>
    = new EventEmitter<{ job: GradeJob, grade: Grade }>();

  rangeDistributionTypeEnum = RangeDistributionTypeIds;
  toggleJobsLabel: string;
  showJobs: boolean;

  private readonly showJobsLabel: string = 'Show Jobs';
  private readonly hideJobsLabel: string = 'Hide Jobs';

  constructor() {  }

  ngOnInit(): void {
    this.toggleJobsLabel = this.showJobs ? this.hideJobsLabel : this.showJobsLabel;
  }

  toggleJobsDisplay(): void {
    this.showJobs = !this.showJobs;
    this.toggleJobsLabel = this.showJobs ? this.hideJobsLabel : this.showJobsLabel;

    if (this.showJobs) {
      this.loadJobs.emit(this.grade);
    }
  }

  formatCurrency(value: number): string {
    const precision = this.rate === 'Hourly' ? 2 : 1;
    return value.toFixed(precision);
  }

  removeJob(jobToRemove: GradeJob) {
    this.jobDeleted.emit({job: jobToRemove, grade: this.grade});
  }

  showJobsDisplay(): void {
    this.showJobs = true;
    this.toggleJobsLabel = this.hideJobsLabel;
    this.loadJobs.emit(this.grade);
  }

}
