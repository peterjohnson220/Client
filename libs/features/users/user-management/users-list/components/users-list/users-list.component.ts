import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserGridItem } from '../../models';
import { UserContext } from 'libs/models';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';


@Component({
  selector: 'pf-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnChanges {
  @Input() usersList: UserGridItem[];
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() filter: string;
  @Input() userContext: UserContext;

  public gridView: GridDataResult;
  public sort: SortDescriptor[] = [{
    field: 'LastName',
    dir: 'asc'
  }];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() { }

  ngOnChanges() { this.loadProducts(); }

  public userSelectionChange({ selectedRows }): void {
    if (selectedRows && selectedRows.length) {
      const item = selectedRows[0].dataItem;
      this.router.navigate([item.UserId], { relativeTo: this.route });
    }
  }

  private loadProducts(): void {
    this.gridView = {
      data: orderBy(this.usersList, this.sort),
      total: this.usersList.length
    };
  }
}
