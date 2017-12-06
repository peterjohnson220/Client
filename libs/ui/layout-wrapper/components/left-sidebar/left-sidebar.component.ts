import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'pf-layout-wrapper-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  sidebarLinks: any = [
    { Name: 'Employees', Url: 'test url', NgAppLink: true, IconClass: 'fa-users' },
    { Name: 'Structures', Url: 'test url', NgAppLink: true, IconClass: 'fa-bar-chart' },
    { Name: 'Pricing Projects', Url: 'test url', NgAppLink: true, IconClass: 'fa-calculator' },
    { Name: 'Data Insights', Url: 'test url', NgAppLink: true, IconClass: 'fa-pie-chart' },
    { Name: 'Jobs', Url: 'test url', NgAppLink: true, IconClass: 'fa-sitemap' },
    { Name: 'Surveys', Url: 'test url', NgAppLink: true, IconClass: 'fa-list-ul' },
    { Name: 'Pay Markets', Url: 'test url', NgAppLink: true, IconClass: 'fa-area-chart' },
    { Name: 'Job Descriptions', Url: 'test url', NgAppLink: true, IconClass: 'fa-file-text-o' },
    { Name: 'Resources', Url: 'test url', NgAppLink: true, IconClass: 'fa-newspaper-o' },
    { Name: 'Service', Url: 'test url', NgAppLink: true, IconClass: 'fa-question-circle-o' },
    { Name: 'Community', Url: 'test url', NgAppLink: true, IconClass: 'fa-commenting-o' },
    { Name: 'Activity', Url: 'test url', NgAppLink: true, IconClass: 'fa-bell-o' },
    { Name: 'Data Diagnostics', Url: 'test url', NgAppLink: true, IconClass: 'fa-ambulance' },
    { Name: 'Referrals', Url: 'test url', NgAppLink: true, IconClass: 'fa-thumbs-o-up' },
    { Name: 'Ideas', Url: 'test url', NgAppLink: true, IconClass: 'fa-lightbulb-o' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
