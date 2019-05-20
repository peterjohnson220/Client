import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pf-company-admin-users-list-page',
  templateUrl: './company-admin-users-list.page.html',
  styleUrls: ['./company-admin-users-list.page.scss']
})
export class CompanyAdminUsersListPageComponent implements OnInit {
  companyId = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.companyId = this.route.snapshot.params['companyId'];
  }
}


