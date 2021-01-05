import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { JobMatchCut } from 'libs/models/payfactors-api';

import { JobToPrice } from '../../models';

import { LEGACY_PROJECTS, MODIFY_PRICINGS } from '../../constants';

@Component({
  selector: 'pf-job-to-price',
  templateUrl: './job-to-price.component.html',
  styleUrls: ['./job-to-price.component.scss']
})
export class JobToPriceComponent implements OnInit {
  @Input() job: JobToPrice;
  @Input() rate: string;
  @Input() dragging: boolean;
  @Input() featureImplementation = LEGACY_PROJECTS;
  @Output() loadDataCuts: EventEmitter<JobToPrice> = new EventEmitter<JobToPrice>();
  @Output() cutDeleted: EventEmitter<{ jobCut: JobMatchCut, job: JobToPrice }>
    = new EventEmitter<{ jobCut: JobMatchCut, job: JobToPrice }>();

  toggleDataCutsLabel: string;
  showDataCuts: boolean;
  showJobDetail: boolean;
  modifyPricingsImplementation = MODIFY_PRICINGS;

  private readonly showCutsLabel: string = 'Show Cuts';
  private readonly hideCutsLabel: string = 'Hide Cuts';

  constructor() {  }

  get toggleJobDetailLabel() {
    return (this.showJobDetail ? 'Hide' : 'Show') + ' Job Detail';
  }

  ngOnInit(): void {
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;
  }

  toggleDataCutsDisplay(): void {
    this.showDataCuts = !this.showDataCuts;
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;

    if (this.showDataCuts) {
      this.loadDataCuts.emit(this.job);
    }
  }

  toggleJobDetailDisplay(): void {
    this.showJobDetail = !this.showJobDetail;
  }

  removeMatchCut(cutToRemove: JobMatchCut): void {
    if (this.job.TotalDataCuts === 1) {
      this.hideDataCutsDisplay();
    }
    this.cutDeleted.emit({jobCut: cutToRemove, job: this.job});
  }

  formatCurrency(value: number): string {
    const precision = this.rate === 'Hourly' ? 2 : 1;
    return value.toFixed(precision);
  }

  showDataCutsDisplay(): void {
    this.showDataCuts = true;
    this.toggleDataCutsLabel = this.hideCutsLabel;
    this.loadDataCuts.emit(this.job);
  }

  private hideDataCutsDisplay(): void {
    this.showDataCuts = false;
    this.toggleDataCutsLabel = this.showCutsLabel;
  }

}
