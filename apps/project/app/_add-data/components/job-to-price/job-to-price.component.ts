import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


import { JobToPrice } from '../../models';

@Component({
  selector: 'pf-job-to-price',
  templateUrl: './job-to-price.component.html',
  styleUrls: ['./job-to-price.component.scss']
})
export class JobToPriceComponent implements OnInit {
  @Input() job: JobToPrice;
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
  }

  toggleJobDetailDisplay(): void {
    this.showJobDetail = !this.showJobDetail;
  }

}
