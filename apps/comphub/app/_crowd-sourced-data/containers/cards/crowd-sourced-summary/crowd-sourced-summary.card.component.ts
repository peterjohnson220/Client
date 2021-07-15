import { Component, OnInit } from '@angular/core';

import { ComphubPages } from '../../../../_shared/data';

@Component({
  selector: 'pf-crowd-sourced-summary-card',
  templateUrl: './crowd-sourced-summary.card.component.html',
  styleUrls: ['./crowd-sourced-summary.card.component.scss']
})
export class CrowdSourcedSummaryCardComponent implements OnInit {
  comphubPages = ComphubPages;

  constructor() { }

  ngOnInit() { }

}
