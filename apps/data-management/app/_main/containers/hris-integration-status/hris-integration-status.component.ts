import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {ConnectionSummary} from '../../models';

@Component({
  selector: 'pf-hris-integration-status',
  templateUrl: './hris-integration-status.component.html',
  styleUrls: ['./hris-integration-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisIntegrationStatusComponent {
  @Input() connectionSummary: ConnectionSummary;

  constructor() {
  }
}
