import { Component, OnDestroy, OnInit } from '@angular/core';

import { ComphubPages } from '../../../../_main/data';

@Component({
  selector: 'pf-crowd-sourced-data-page',
  templateUrl: './crowd-sourced-data.page.html',
  styleUrls: ['./crowd-sourced-data.page.scss']
})
export class CrowdSourcedDataPageComponent implements OnInit, OnDestroy {
  comphubPages = ComphubPages;

  constructor() {}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

}
