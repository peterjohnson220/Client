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
  @Output() onContinueIntegrationSetupClicked = new EventEmitter();
  @Input() transferMethod: TransferMethodTypes;
  @Input() hasSavedSchedules: boolean;


  public inbound = TransferMethodTypes.HRIS_INTEGRATION;
  public outboundJdm = TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION;

  constructor() {
  }

  createNewIntegration() {
    this.onCreateNewIntegrationClicked.emit();
  }

  continueIntegrationSetup() {
    this.onContinueIntegrationSetupClicked.emit();
  }
}
