import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';

import { ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';

import { ServicePageViewId } from '../models';

@Component({
  selector: 'pf-service-page',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss']
})
export class ServicePageComponent implements AfterViewInit {
  @ViewChild('statusColumn', { static: false }) statusColumn: ElementRef;
  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'UserTickets_Create_Date'
  }];
  actionBarConfig: ActionBarConfig;
  pageViewId = ServicePageViewId;
  colTemplates = {};

  constructor() {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      AllowSaveFilter: false
    };
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'UserTicket_State': { Template: this.statusColumn }
    };
  }
}
