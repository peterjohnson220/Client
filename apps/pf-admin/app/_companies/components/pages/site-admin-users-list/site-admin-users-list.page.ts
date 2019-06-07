import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pf-site-admin-users-list-page',
  templateUrl: './site-admin-users-list.page.html',
  styleUrls: ['./site-admin-users-list.page.scss']
})
export class SiteAdminUsersListPageComponent implements OnInit {
  companyId = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.companyId = this.route.snapshot.params['companyId'];
  }
}
