import { Component, Input, OnInit } from '@angular/core';

import { ImageControl } from '../../models/';

@Component({
  selector: 'pf-trs-image-control',
  templateUrl: './trs-image-control.component.html',
  styleUrls: ['./trs-image-control.component.scss']
})
export class TrsImageControlComponent implements OnInit {

  @Input() controlData: ImageControl;
  @Input() employee;

  constructor() { }

  ngOnInit() {
  }

}
