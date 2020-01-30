import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'pf-hris-integration-panel',
  templateUrl: './hris-integration-panel.component.html',
  styleUrls: ['./hris-integration-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisIntegrationPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
