import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {TitleControl} from '../../models';

@Component({
  selector: 'pf-trs-title-control',
  templateUrl: './trs-title-control.component.html',
  styleUrls: ['./trs-title-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsTitleControlComponent implements OnInit {

  @Input() controlData: TitleControl;

  constructor() { }

  ngOnInit() {
  }
}
