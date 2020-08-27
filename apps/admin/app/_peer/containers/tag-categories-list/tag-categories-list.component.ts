/* tslint:disable:no-bitwise */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataStateChangeEvent, GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { EntityTypesFlag } from 'libs/models/peer';
import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromTagCategoriesActions from '../../actions/tag-categories.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-tag-categories-list',
  templateUrl: './tag-categories-list.component.html',
  styleUrls: ['./tag-categories-list.component.scss']
})

export class TagCategoriesListComponent implements OnInit, OnDestroy {
  @Input() ExchangeId = -1;
  @Input() InAddTagCategoriesModal = false;
  @Output() onCellClick = new EventEmitter();

  tagCategoriesLoading$: Observable<boolean>;
  tagCategoriesLoadingError$: Observable<boolean>;
  tagCategoriesGrid$: Observable<GridDataResult>;
  gridState$: Observable<State>;
  gridState: State;
  gridStateSubscription: Subscription;
  selections$: Observable<number[]>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.tagCategoriesLoading$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesLoading));
    this.tagCategoriesLoadingError$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesLoadingError));
    this.tagCategoriesGrid$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesGrid));
    this.selections$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesGridSelections));
  }

  selectionKey(context: RowArgs): number {
    return context.dataItem.TagCategoryId;
  }

  // Events
  handleTagCategoriesGridReload() {
    this.loadTagCategories();
  }

  handleCellClick(event: any): void {
    if (this.InAddTagCategoriesModal) {
      const selectedTagCategoryId = event.dataItem.TagCategoryId;
      this.store.dispatch(new fromGridActions.ToggleRowSelection(GridTypeEnum.TagCategories, selectedTagCategoryId));
      this.onCellClick.emit();
    }
  }

  // Grid
  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.TagCategories, state));
    this.loadTagCategories();
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
    if (this.InAddTagCategoriesModal) {
      this.gridState$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesGridStateForModal));
    } else {
      this.gridState$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesGridState));
      this.loadTagCategories();
    }
    this.gridStateSubscription = this.gridState$.subscribe(gridState => {
      this.gridState = cloneDeep(gridState);
    });
  }

  ngOnDestroy(): void {
    this.gridStateSubscription.unsubscribe();
  }

  // Helper methods
  loadTagCategories(): void {
    this.gridState$.pipe(take(1)).subscribe(gridState => {
      this.store.dispatch(new fromTagCategoriesActions.LoadTagCategories(
        {
          exchangeId: this.ExchangeId,
          listState: gridState
        }
      ));
    });
  }
}
