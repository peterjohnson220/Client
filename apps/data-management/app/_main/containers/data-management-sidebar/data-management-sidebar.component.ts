import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'pf-data-management-sidebar',
  templateUrl: './data-management-sidebar.component.html',
  styleUrls: ['./data-management-sidebar.component.scss']
})
export class DataManagementSidebarComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
