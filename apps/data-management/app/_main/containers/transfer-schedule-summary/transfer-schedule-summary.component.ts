import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pf-transfer-schedule-summary',
  templateUrl: './transfer-schedule-summary.component.html',
  styleUrls: ['./transfer-schedule-summary.component.scss']
})
export class TransferScheduleSummaryComponent implements OnInit {
  defaultEntities = ['Paymarkets', 'Jobs', 'Structures', 'Structure Mappings', 'Employees'];
  // TODO: Replace this with observable and async pipe
  configured = false;

  constructor() { }

  ngOnInit() {
  }

}
