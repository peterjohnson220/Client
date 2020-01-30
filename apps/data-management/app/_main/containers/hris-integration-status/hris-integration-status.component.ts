import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'pf-hris-integration-status',
  templateUrl: './hris-integration-status.component.html',
  styleUrls: ['./hris-integration-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisIntegrationStatusComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
