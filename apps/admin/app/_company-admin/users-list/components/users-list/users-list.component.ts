import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserGridItem } from '../../models';
import { UserContext } from 'libs/models';


@Component({
  selector: 'pf-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @Input() usersList: UserGridItem[];
  @Input() loading: boolean;
  @Input() filter: string;
  @Input() userContext: UserContext;

  constructor(private router: Router) { }

  ngOnInit() { }

  public userSelectionChange({ selectedRows }): void {
    if (selectedRows && selectedRows.length) {
      const item = selectedRows[0].dataItem;
      this.router.navigate(['/company-admin/', item.CompanyId, 'users', item.UserId]);
    }
  }
}
