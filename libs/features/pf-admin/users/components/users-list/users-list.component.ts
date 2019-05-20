import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserGridItem } from '../../models';


@Component({
  selector: 'pf-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @Input() usersList: UserGridItem[];
  @Input() loading: boolean;
  @Input() filter: string;

  constructor(private router: Router) { }

  ngOnInit() { }

  public userSelectionChange({ selectedRows }): void {
    if (selectedRows && selectedRows.length) {
      const item = selectedRows[0].dataItem;
      this.router.navigate(['/companies/', item.CompanyId, 'users', item.UserId]);
    }
  }
}
