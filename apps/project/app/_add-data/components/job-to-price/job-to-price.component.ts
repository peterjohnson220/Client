import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


import { JobToPrice } from '../../models';

@Component({
  selector: 'pf-job-to-price',
  templateUrl: './job-to-price.component.html',
  styleUrls: ['./job-to-price.component.scss']
})
export class JobToPriceComponent implements OnInit {
  @Input() job: JobToPrice;
  @Input() rate: string;
  @Output() loadDataCuts: EventEmitter<JobToPrice> = new EventEmitter<JobToPrice>();

  toggleDataCutsLabel: string;
  showDataCuts: boolean;
  showJobDetail: boolean;

  private readonly showCutsLabel: string = 'Show Cuts';
  private readonly hideCutsLabel: string = 'Hide Cuts';

  constructor(
  ) {  }
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

  formatCurrency(value: number): string {
    const precision = this.rate === 'Hourly' ? 2 : 1;
    return value.toFixed(precision);
  }

}
