import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { StatementModeEnum, TitleControl, UpdateTitleRequest } from '../../models';

@Component({
  selector: 'pf-trs-title-control',
  templateUrl: './trs-title-control.component.html',
  styleUrls: ['./trs-title-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsTitleControlComponent implements OnInit {

  @Input() controlData: TitleControl;
  @Input() mode: StatementModeEnum;

  @Output() titleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();

  modeEnum = StatementModeEnum;

  constructor() { }

  ngOnInit() {
  }

  onTitleChange(title) {
    this.titleChange.emit({ControlId: this.controlData.Id, Title: title});
  }
}
