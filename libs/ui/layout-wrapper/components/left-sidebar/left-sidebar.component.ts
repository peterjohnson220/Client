import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'pf-layout-wrapper-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeftSidebarComponent implements OnInit {
  @Input() leftSidebarToggle: boolean;

  sidebarLinks: any = [
    { Name: 'Employees', Url: 'test url', NgAppLink: false, IconClass: 'fa-users' },
    { Name: 'Structures', Url: 'test url', NgAppLink: false, IconClass: 'fa-bar-chart' },
    { Name: 'Pricing Projects', Url: 'test url', NgAppLink: false, IconClass: 'fa-calculator' },
    { Name: 'Data Insights', Url: 'test url', NgAppLink: false, IconClass: 'fa-pie-chart' },
    { Name: 'Jobs', Url: 'test url', NgAppLink: false, IconClass: 'fa-sitemap' },
    { Name: 'Surveys', Url: 'test url', NgAppLink: false, IconClass: 'fa-list-ul' },
    { Name: 'Pay Markets', Url: 'test url', NgAppLink: false, IconClass: 'fa-area-chart' },
    { Name: 'Job Descriptions', Url: 'test url', NgAppLink: false, IconClass: 'fa-file-text-o' },
    { Name: 'Resources', Url: 'test url', NgAppLink: false, IconClass: 'fa-newspaper-o' },
    { Name: 'Service', Url: 'test url', NgAppLink: false, IconClass: 'fa-question-circle-o' },
    { Name: 'Community', Url: 'test url', NgAppLink: false, IconClass: 'fa-commenting-o' },
    { Name: 'Activity', Url: 'test url', NgAppLink: false, IconClass: 'fa-bell-o' },
    { Name: 'Data Diagnostics', Url: 'test url', NgAppLink: false, IconClass: 'fa-ambulance' },
    { Name: 'Referrals', Url: 'test url', NgAppLink: false, IconClass: 'fa-thumbs-o-up' },
    { Name: 'Ideas', Url: 'test url', NgAppLink: false, IconClass: 'fa-lightbulb-o' }
  ];
  sidebarToggle = true;
  constructor() { }

  ngOnInit() {
  }

}
