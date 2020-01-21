import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'pf-hris-integration-sidebar',
  templateUrl: './hris-integration-sidebar.component.html',
  styleUrls: ['./hris-integration-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisIntegrationSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
