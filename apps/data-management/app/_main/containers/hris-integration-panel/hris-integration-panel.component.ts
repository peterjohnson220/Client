import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

import {TransferMethodTypes} from 'libs/constants/hris-api';

import {ConnectionSummary} from '../../models';

@Component({
  selector: 'pf-hris-integration-panel',
  templateUrl: './hris-integration-panel.component.html',
  styleUrls: ['./hris-integration-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisIntegrationPanelComponent {
  @Input() transferMethodType: TransferMethodTypes;
  @Input() connectionSummary: ConnectionSummary;
  @Input() hasSavedExportSchedules: boolean;
  @Output() onMappingButtonClicked = new EventEmitter();
  @Output() onCreateNewIntegrationClicked = new EventEmitter();
  @Output() onTransferScheduleButtonClick = new EventEmitter();
  @Output() onEntitySelectionButtonClick = new EventEmitter();
  @Output() onContinueIntegrationSetupClicked = new EventEmitter();
  @Output() onReAuthClicked = new EventEmitter();

  public inbound = TransferMethodTypes.HRIS_INTEGRATION;
  public outboundJdm = TransferMethodTypes.HRIS_OUTBOUND_JDM_INTEGRATION;

  matchesConnectionStatus(status: string) {
    if (!status) {
      return false;
    }
    return this.connectionSummary && this.connectionSummary.statuses.length &&
           this.connectionSummary.statuses.find(s => s === status);
  }

  goToDataMapping() {
    this.onMappingButtonClicked.emit(this.transferMethodType);
  }

  createNewIntegration() {
    this.onCreateNewIntegrationClicked.emit(this.transferMethodType);
  }

  continueIntegrationSetup() {
    this.onContinueIntegrationSetupClicked.emit(this.transferMethodType);
  }

  openReAuthModal() {
    this.onReAuthClicked.emit();
  }

  goToTransferSchedule() {
    this.onTransferScheduleButtonClick.emit(this.transferMethodType);
  }

  goToEntitySelection() {
    this.onEntitySelectionButtonClick.emit(this.transferMethodType);
  }
}
