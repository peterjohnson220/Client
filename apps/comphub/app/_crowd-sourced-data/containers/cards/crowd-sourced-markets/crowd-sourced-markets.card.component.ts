import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ComphubPages } from '../../../../_shared/data';

@Component({
  selector: 'pf-crowd-sourced-markets-card',
  templateUrl: './crowd-sourced-markets.card.component.html',
  styleUrls: ['./crowd-sourced-markets.card.component.scss']
})
export class CrowdSourcedMarketsCardComponent implements OnInit {
  comphubPages = ComphubPages;

  constructor() { }

  ngOnInit() { }

}
