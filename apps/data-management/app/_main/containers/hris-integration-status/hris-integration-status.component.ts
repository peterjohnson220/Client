import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

import { TransferMethodTypes } from 'libs/constants';

import {ConnectionSummary} from '../../models';

@Component({
  selector: 'pf-hris-integration-status',
  templateUrl: './hris-integration-status.component.html',
  styleUrls: ['./hris-integration-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisIntegrationStatusComponent {
  @Input() connectionSummary: ConnectionSummary;
  @Output() onCreateNewIntegrationClicked = new EventEmitter();
  @Input() transferMethod: TransferMethodTypes;

  constructor() {
  }

  createNewIntegration() {
    this.onCreateNewIntegrationClicked.emit();
  }
}
