import { Component } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { State } from '@progress/kendo-data-query';

import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';

import * as fromPeerAdminReducer from '../../../reducers';
import * as fromTagCategoriesActions from '../../../actions/tag-categories.actions';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-tag-categories',
  templateUrl: './tag-categories.page.html',
  styleUrls: ['./tag-categories.page.scss']
})

export class TagCategoriesPageComponent {

  env = environment;

  gridState$: Observable<State>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.gridState$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesGridState));
  }

  // Events
  openCreateTagCategoryModal() {
    this.store.dispatch(new fromTagCategoriesActions.OpenCreateTagCategoryModal());
  }

  updateSearchFilter(newSearchTerm: string) {
    this.store.dispatch(new fromGridActions.UpdateFilter(
      GridTypeEnum.TagCategories,
      {columnName: 'DisplayName', value: newSearchTerm}
    ));
    this.loadTagCategories();
  }

  loadTagCategories() {
    this.gridState$.pipe(take(1)).subscribe(gridState => {
      this.store.dispatch(new fromTagCategoriesActions.LoadTagCategories(
        {
          exchangeId: -1,
          listState: gridState
        }
      ));
    });
  }
}
