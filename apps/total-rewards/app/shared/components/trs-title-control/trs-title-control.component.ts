import { Component, Input, OnInit } from '@angular/core';

import {TitleControl} from '../../models';

@Component({
  selector: 'pf-trs-title-control',
  templateUrl: './trs-title-control.component.html',
  styleUrls: ['./trs-title-control.component.scss']
})
export class TrsTitleControlComponent implements OnInit {

  @Input() controlData: TitleControl;

  constructor() { }

  ngOnInit() {
  }
}
