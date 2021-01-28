import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'pf-loader-dashboard-page',
  templateUrl: './loader-dashboard.page.html',
  styleUrls: ['./loader-dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
