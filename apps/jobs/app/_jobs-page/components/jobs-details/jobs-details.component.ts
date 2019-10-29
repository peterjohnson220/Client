import { Component, Output, EventEmitter, ViewEncapsulation, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataViewFilter } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobsDetailsComponent {

  @Input() jobDetailsFilters: DataViewFilter[];

  @Output() onClose = new EventEmitter();

  constructor() { }

  close() {
    this.onClose.emit(null);
  }
}
