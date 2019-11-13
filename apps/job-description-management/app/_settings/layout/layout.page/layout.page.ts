import { Component } from '@angular/core';

@Component({
  selector: 'pf-settings-layout-page',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss']
})
export class LayoutPageComponent {
  navLinks = [
    {name: 'Job Description Views', route: '/settings/job-description-views' },
    {name: 'Routing Workflows', route: '/settings/workflows' },
    {name: 'Manage Company Controls', route: '/settings/company-controls' },
    {name: 'Footer View', route: '/settings/jdm-footer-view' }
  ];

  constructor() {}
}
