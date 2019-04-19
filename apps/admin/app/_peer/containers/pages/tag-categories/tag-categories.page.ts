/* tslint:disable:no-bitwise */
import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { EntityTypesFlag } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../../reducers';
import * as fromTagCategoriesActions from '../../../actions/tag-categories.actions';
import { GridHelperService } from '../../../services';

@Component({
  selector: 'pf-tag-categories',
  templateUrl: './tag-categories.page.html',
  styleUrls: ['./tag-categories.page.scss']
})

export class TagCategoriesPageComponent implements OnInit {
  tagCategoriesLoading$: Observable<boolean>;
  tagCategoriesLoadingError$: Observable<boolean>;
  tagCategoriesGrid$: Observable<GridDataResult>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private gridHelperService: GridHelperService
  ) {
    this.tagCategoriesLoading$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesLoading));
    this.tagCategoriesLoadingError$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesLoadingError));
    this.tagCategoriesGrid$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesGrid));
  }

  // Events
  handleTagCategoriesGridReload() {
    this.store.dispatch(new fromTagCategoriesActions.LoadTagCategories(''));
  }

  handleSearchChanged(query: string): void {
    this.gridHelperService.loadTagCategories(query);
  }

  openCreateTagCategoryModal() {
    this.store.dispatch(new fromTagCategoriesActions.OpenCreateTagCategoryModal());
  }

  getEntityTypes(types: number) {
    const x: EntityTypesFlag = types;
    let i = 0;
    let type: number;
    let typeStr = '';
    if (types === 0) {
      typeStr = EntityTypesFlag[types];
    } else {
      while (EntityTypesFlag[type = 1 << i++]) {
        if (x & type) {
          typeStr += EntityTypesFlag[type] + ', ';
        }
      }
      typeStr = typeStr.replace(/,\s*$/, '');
    }
    return typeStr;
  }

  ngOnInit() {
    this.gridHelperService.loadTagCategories('');
  }
}
