import { Component, Output, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

@Component({
  selector: 'pf-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobsDetailsComponent {

  @Input() jobDetailsFilters: PfDataGridFilter[];

  @Output() onClose = new EventEmitter();
  @Output() tabChanged = new EventEmitter();

  tabPageViewIds = {
    PricingDetails: '86870F9F-C148-4626-92DE-C2B73B6E0D35',
    Employees: '12147D19-592A-44AF-9696-7F5347873D5E',
    Structures: '36FE36BF-A348-49DE-8511-B0DE46F52BDB',
    Projects: 'C029F3C2-0FBC-4E1F-96A1-611879E2B2A2',
    History: 'c4c03aff-4164-4a47-800f-97f0fee46623'
  };

  constructor() { }

  close() {
    this.onClose.emit(null);
  }

  tabChange(event: any) {
    if (this.tabPageViewIds[event.activeId]) {
      this.tabChanged.emit(this.tabPageViewIds[event.activeId]);
    }
  }
}
